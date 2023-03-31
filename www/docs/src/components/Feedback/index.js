import React, { useRef, useState, useEffect } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import './index.css';

import useIsBrowser from '@docusaurus/useIsBrowser';
import {useLocation} from '@docusaurus/router';
import uuid from 'react-uuid';
import { request } from "@octokit/request";

export default function Feedback ({
  event,
  question = 'Was this page helpful?',
  positiveBtn = 'Yes',
  negativeBtn = 'No',
  positiveQuestion = 'What was most helpful?',
  negativeQuestion = 'What can we improve?',
  submitBtn = 'Submit',
  submitMessage = 'Thank you for helping improve our documentation!',
  showPossibleSolutions = true
}) {
  const [showForm, setShowForm] = useState(false);
  const [submittedFeedback, setSubmittedFeedback] = useState(false);
  const [loading, setLoading] = useState(false);
  const inlineFeedbackRef = useRef(null);
  const inlineQuestionRef = useRef(null);
  const inlineMessageRef = useRef(null)
  const [positiveFeedback, setPositiveFeedback] = useState(false);
  const [message, setMessage] = useState("");
  const [id, setId] = useState(null);
  const [possibleSolutionsQuery, setPossibleSolutionsQuery] = useState('')
  const [possibleSolutions, setPossibleSolutions] = useState([]);
  const nodeRef = submittedFeedback ? inlineMessageRef : (showForm ? inlineQuestionRef : inlineFeedbackRef);

  const isBrowser = useIsBrowser();
  const location = useLocation();

  function handleFeedback (e) {
    const feedback = e.target.classList.contains('positive');
    submitFeedback(e, feedback)
    setPositiveFeedback(feedback);
    setShowForm(true);
  }

  function submitFeedback (e, feedback = null) {
    if (isBrowser) {
      if (window.analytics) {
        if (showForm) {
          setLoading(true);
        }
        window.analytics.track(event, {
          url: location.pathname,
          label: document.title,
          feedback: (feedback !== null && feedback) || (feedback === null && positiveFeedback) ? 'yes' : 'no',
          message,
          uuid: id
        }, function () {
          if (showForm) {
            setLoading(false);
            checkAvailableSolutions(positiveFeedback, message);
            resetForm();
          }
        })
      } else {
        if (showForm) {
          resetForm();
        }
      }
    }
  }

  function resetForm () {
    setShowForm(false);
    setSubmittedFeedback(true);
    if (message) {
      setId(null);
    }
  }

  function constructQuery (searchQuery) {
    return `${searchQuery} repo:medusajs/medusa is:closed is:issue`; //Github does not allow queries longer than 256 characters
  }

  function searchGitHub (query) {
    return request(`GET /search/issues`, {
      q: query,
      sort: 'updated',
      per_page: 3,
    })
  }

  async function checkAvailableSolutions (feedback, message) {
    if (showPossibleSolutions && !feedback) {
      //fetch some possible solutions related to the answer.
      let query = constructQuery(message ? message.substring(0, 256) : document.title)
      let result = await searchGitHub(query);

      if (!result.data.items.length && message) {
        query = constructQuery(document.title)
        result = await searchGitHub(query)
      }

      setPossibleSolutionsQuery(query);
      setPossibleSolutions(result.data.items);
    }
  }

  useEffect(() => {
    if (!id) {
      setId(uuid())
    }
  }, [id])

  return (
    <div className='feedback-container'>
      <SwitchTransition mode="out-in">
        <CSSTransition
          key={showForm}
          nodeRef={nodeRef}
          timeout={300}
          addEndListener={(done) => {
            nodeRef.current.addEventListener("transitionend", done, false);
          }}
          classNames={{
            enter: 'fade-in',
            exit: 'fade-out'
          }}
        >
          <>
            {(!showForm && !submittedFeedback) && (
              <div className='inline-feedback' ref={inlineFeedbackRef}>
                <span>{question}</span>
                <button className='positive feedback-btn' onClick={handleFeedback}>{positiveBtn}</button>
                <button className='negative feedback-btn' onClick={handleFeedback}>{negativeBtn}</button>
              </div>
            )}
            {(showForm && !submittedFeedback) && (
              <div className='inline-question' ref={inlineQuestionRef}>
                <span>{positiveFeedback ? positiveQuestion : negativeQuestion}</span>
                <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                <button className='feedback-btn' onClick={submitFeedback} disabled={loading}>{submitBtn}</button>
              </div>
            )}
            {submittedFeedback && (
              <div className='feedback-message-wrapper'>
                <div className='feedback-message' ref={inlineMessageRef}>
                  <span>{submitMessage}</span>
                  {possibleSolutions.length > 0 && (
                  <div className='solutions-wrapper'>
                    <span className='solutions-message'>If you faced a problem, here are some possible solutions from GitHub:</span>
                    <ul>
                      {possibleSolutions.map((solution) => (
                        <li key={solution.url}>
                          <a href={solution.html_url} target="_blank">{solution.title}</a>
                        </li>
                      ))}
                    </ul>
                    <span>Explore more issues in <a 
                        href={`https://github.com/medusajs/medusa/issues?q=${possibleSolutionsQuery}`}
                        target="_blank"
                      >
                        the GitHub repository
                      </a>
                    </span>
                  </div>
                )}
                </div>
              </div>
            )}
          </>
        </CSSTransition>
      </SwitchTransition>
    </div>
  )
}