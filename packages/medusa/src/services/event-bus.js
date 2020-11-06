import Bull from "bull"
import Redis from "ioredis"

/**
 * Can keep track of multiple subscribers to different events and run the
 * subscribers when events happen. Events will run asynchronously.
 * @interface
 */
class EventBusService {
  constructor(
    { logger, stagedJobModel, redisClient, redisSubscriber },
    config,
    singleton = true
  ) {
    const opts = {
      createClient: type => {
        switch (type) {
          case "client":
            return redisClient
          case "subscriber":
            return redisSubscriber
          default:
            return new Redis(config.projectConfig.redis_url)
        }
      },
    }

    this.config_ = config
    /** @private {logger} */
    this.logger_ = logger

    /** @private {BullQueue} */
    this.queue_ = new Bull(`${this.constructor.name}:queue`, opts)

    this.stagedJobModel_ = stagedJobModel

    if (singleton) {
      /** @private {object} */
      this.observers_ = {}

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

      // setInterval(this.enqueuer_, 200)
      this.enqueuer_()
    }
  }

  withSession(session) {
    const cloned = new EventBusService(
      {
        stagedJobModel: this.stagedJobModel_,
        logger: this.logger_,
        redisClient: this.redisClient_,
        redisSubscriber: this.redisSubscriber_,
      },
      this.config_,
      false
    )

    cloned.current_session = session
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
   *
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
  emit(eventName, data) {
    if (this.current_session) {
      return this.stagedJobModel_.create(
        [
          {
            event_name: eventName,
            data,
          },
        ],
        { session: this.current_session }
      )
    } else {
      this.queue_.add({ eventName, data }, { removeOnComplete: true })
    }
  }

  async sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms)
    })
  }

  async enqueuer_() {
    while (true) {
      const jobs = await this.stagedJobModel_.find({}, {}, 0, 1000)
      await Promise.all(
        jobs.map(j => {
          this.queue_
            .add(
              { eventName: j.event_name, data: j.data },
              { removeOnComplete: true }
            )
            .then(() => this.stagedJobModel_.deleteOne({ _id: j._id }))
        })
      )
      await this.sleep(1000)
    }
  }

  /**
   * Handles incoming jobs.
   * @param job {{ eventName: (string), data: (any) }}
   *    eventName - the name of the event to process
   *    data - data to send to the subscriber
   *
   * @returns {Promise} resolves to the results of the subscriber calls.
   */
  worker_ = job => {
    const { eventName, data } = job.data
    const observers = this.observers_[eventName] || []
    this.logger_.info(
      `Processing ${eventName} which has ${observers.length} subscribers`
    )

    return Promise.all(
      observers.map(subscriber => {
        return subscriber(data).catch(err => {
          this.logger_.warn(
            `An error occured while processing ${eventName}: ${err}`
          )
          return err
        })
      })
    )
  }

  cronWorker_ = job => {
    const { eventName, data } = job.data
    const observers = this.cronHandlers_[eventName] || []
    this.logger_.info(`Processing cron job: ${eventName}`)

    return Promise.all(
      observers.map(subscriber => {
        return subscriber(data).catch(err => {
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
   * @return void
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
