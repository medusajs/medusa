import React, { useRef, useState, useEffect } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import './index.css';

import useIsBrowser from '@docusaurus/useIsBrowser';
import {useLocation} from '@docusaurus/router';
import uuid from 'react-uuid';

export default function Feedback ({
  event,
  question = 'Was this page helpful?',
  positiveBtn = 'Yes',
  negativeBtn = 'No',
  positiveQuestion = 'What was most helpful?',
  negativeQuestion = 'What can we improve?',
  submitBtn = 'Submit',
  submitMessage = 'Thank you for helping improve our documentation!'
}) {
  const [showForm, setShowForm] = useState(false);
  const [submittedFeedback, setSubmittedFeedback] = useState(false);
  const [loading, setLoading] = useState(false);
  const inlineFeedbackRef = useRef(null);
  const inlineQuestionRef = useRef(null);
  const inlineMessageRef = useRef(null)
  const [positiveFeedback, setPositiveFeedback] = useState(false);
  const [message, setMessage] = useState("");
  const [id, setId] = useState(null)
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
    console.log(id, feedback, (feedback !== null && feedback) || (feedback === null && positiveFeedback) ? 'yes' : 'no')
    if (isBrowser) {
      console.log("here1");
      if (window.analytics) {
        console.log("here3");
        if (showForm) {
          setLoading(true);
        }
        console.log("here4");
        window.analytics.track(event, {
          url: location.pathname,
          label: document.title,
          feedback: (feedback !== null && feedback) || (feedback === null && positiveFeedback) ? 'yes' : 'no',
          message,
          uuid: id
        }, function () {
          console.log("here5");
          if (showForm) {
            setLoading(false);
            console.log("here6");
            resetForm();
          }
        })
      } else {
        console.log("here7");
        if (showForm) {
          console.log("here8");
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
              <div className='feedback-message' ref={inlineMessageRef}>
                {submitMessage}
              </div>
            )}
          </>
        </CSSTransition>
      </SwitchTransition>
    </div>
  )
}