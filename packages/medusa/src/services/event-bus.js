import Bull from "bull"
import Redis from "ioredis"

/**
 * Can keep track of multiple subscribers to different events and run the
 * subscribers when events happen. Events will run asynchronously.
 * @class
 */
class EventBusService {
  constructor(
    { manager, logger, stagedJobRepository, redisClient, redisSubscriber },
    config,
    singleton = true
  ) {
    const opts = {
      createClient: (type) => {
        switch (type) {
          case "client":
            return redisClient
          case "subscriber":
            return redisSubscriber
          default:
            if (config.projectConfig.redis_url) {
              return new Redis(config.projectConfig.redis_url)
            }
            return redisClient
        }
      },
    }

    this.config_ = config

    /** @private {EntityManager} */
    this.manager_ = manager

    /** @private {logger} */
    this.logger_ = logger

    this.stagedJobRepository_ = stagedJobRepository

    if (singleton) {
      /** @private {object} */
      this.observers_ = {}

      /** @private {BullQueue} */
      this.queue_ = new Bull(`${this.constructor.name}:queue`, opts)

      /** @private {object} to handle cron jobs */
      this.cronHandlers_ = {}

      this.redisClient_ = redisClient
      this.redisSubscriber_ = redisSubscriber

      /** @private {BullQueue} used for cron jobs */
      this.cronQueue_ = new Bull(`cron-jobs:queue`, opts)

      // Register our worker to handle emit calls
      this.queue_.process(this.worker_)

      // Register cron worker
      this.cronQueue_.process(this.cronWorker_)

      if (process.env.NODE_ENV !== "test") {
        this.startEnqueuer()
      }
    }
  }

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new EventBusService(
      {
        manager: transactionManager,
        stagedJobRepository: this.stagedJobRepository_,
        logger: this.logger_,
        redisClient: this.redisClient_,
        redisSubscriber: this.redisSubscriber_,
      },
      this.config_,
      false
    )

    cloned.transactionManager_ = transactionManager
    cloned.queue_ = this.queue_

    return cloned
  }

  /**
   * Adds a function to a list of event subscribers.
   * @param {string} event - the event that the subscriber will listen for.
   * @param {func} subscriber - the function to be called when a certain event
   * happens. Subscribers must return a Promise.
   */
  subscribe(event, subscriber) {
    if (typeof subscriber !== "function") {
      throw new Error("Subscriber must be a function")
    }

    if (this.observers_[event]) {
      this.observers_[event].push(subscriber)
    } else {
      this.observers_[event] = [subscriber]
    }
  }

  /**
   * Adds a function to a list of event subscribers.
   * @param {string} event - the event that the subscriber will listen for.
   * @param {func} subscriber - the function to be called when a certain event
   * happens. Subscribers must return a Promise.
   */
  unsubscribe(event, subscriber) {
    if (typeof subscriber !== "function") {
      throw new Error("Subscriber must be a function")
    }

    if (this.observers_[event]) {
      const index = this.observers_[event].indexOf(subscriber)
      if (index !== -1) {
        this.observers_[event].splice(index, 1)
      }
    }
  }

  /**
   * Adds a function to a list of event subscribers.
   * @param {string} event - the event that the subscriber will listen for.
   * @param {func} subscriber - the function to be called when a certain event
   * happens. Subscribers must return a Promise.
   */
  registerCronHandler_(event, subscriber) {
    if (typeof subscriber !== "function") {
      throw new Error("Handler must be a function")
    }

    if (this.observers_[event]) {
      this.cronHandlers_[event].push(subscriber)
    } else {
      this.cronHandlers_[event] = [subscriber]
    }
  }

  /**
   * Calls all subscribers when an event occurs.
   * @param {string} eventName - the name of the event to be process.
   * @param {?any} data - the data to send to the subscriber.
   * @return {BullJob} - the job from our queue
   */
  async emit(eventName, data) {
    if (this.transactionManager_) {
      const stagedJobRepository = this.transactionManager_.getCustomRepository(
        this.stagedJobRepository_
      )

      const created = await stagedJobRepository.create({
        event_name: eventName,
        data,
      })

      return stagedJobRepository.save(created)
    } else {
      this.queue_.add({ eventName, data }, { removeOnComplete: true })
    }
  }

  async sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

  async startEnqueuer() {
    this.enRun_ = true
    this.enqueue_ = this.enqueuer_()
  }

  async stopEnqueuer() {
    this.enRun_ = false
    await this.enqueue_
  }

  async enqueuer_() {
    while (this.enRun_) {
      const listConfig = {
        relations: [],
        skip: 0,
        take: 1000,
      }

      const sjRepo = this.manager_.getCustomRepository(
        this.stagedJobRepository_
      )
      const jobs = await sjRepo.find({}, listConfig)

      await Promise.all(
        jobs.map((job) => {
          this.queue_
            .add(
              { eventName: job.event_name, data: job.data },
              { removeOnComplete: true }
            )
            .then(async () => {
              await sjRepo.remove(job)
            })
        })
      )

      await this.sleep(3000)
    }
  }

  /**
   * Handles incoming jobs.
   * @param {Object} job The job object
   * @return {Promise} resolves to the results of the subscriber calls.
   */
  worker_ = (job) => {
    const { eventName, data } = job.data
    const eventObservers = this.observers_[eventName] || []
    const wildcardObservers = this.observers_["*"] || []

    const observers = eventObservers.concat(wildcardObservers)

    this.logger_.info(
      `Processing ${eventName} which has ${eventObservers.length} subscribers`
    )

    return Promise.all(
      observers.map((subscriber) => {
        return subscriber(data, eventName).catch((err) => {
          this.logger_.warn(
            `An error occured while processing ${eventName}: ${err}`
          )
          console.log(err)
          return err
        })
      })
    )
  }

  /**
   * Handles incoming jobs.
   * @param {Object} job The job object
   * @return {Promise} resolves to the results of the subscriber calls.
   */
  cronWorker_ = (job) => {
    const { eventName, data } = job.data
    const observers = this.cronHandlers_[eventName] || []
    this.logger_.info(`Processing cron job: ${eventName}`)

    return Promise.all(
      observers.map((subscriber) => {
        return subscriber(data, eventName).catch((err) => {
          this.logger_.warn(
            `An error occured while processing ${eventName}: ${err}`
          )
          return err
        })
      })
    )
  }

  /**
   * Registers a cron job.
   * @param {string} eventName - the name of the event
   * @param {object} data - the data to be sent with the event
   * @param {string} cron - the cron pattern
   * @param {function} handler - the handler to call on each cron job
   * @return {void}
   */
  createCronJob(eventName, data, cron, handler) {
    this.logger_.info(`Registering ${eventName}`)
    this.registerCronHandler_(eventName, handler)
    return this.cronQueue_.add(
      {
        eventName,
        data,
      },
      { repeat: { cron } }
    )
  }
}

export default EventBusService
