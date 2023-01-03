import React, { useRef, useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import './index.css';

import useIsBrowser from '@docusaurus/useIsBrowser';
import {useLocation} from '@docusaurus/router';

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
  const [positiveFeedback, setPositiveFeedbac] = useState(false);
  const [message, setMessage] = useState("");
  const nodeRef = submittedFeedback ? inlineMessageRef : (showForm ? inlineQuestionRef : inlineFeedbackRef);

  const isBrowser = useIsBrowser();
  const location = useLocation();

  function handleFeedback (e) {
    setPositiveFeedbac(e.target.classList.contains('positive'));
    setShowForm(true);
  }

  function submitFeedback (e) {
    if (isBrowser) {
      if (window.analytics) {
        setLoading(true);
        window.analytics.track(event, {
          url: location.pathname,
          label: document.title,
          feedback: positiveFeedback ? 'yes' : 'no',
          message
        }, function () {
          setLoading(false);
          setShowForm(false);
          setSubmittedFeedback(true);
        })
      } else {
        setShowForm(false);
        setSubmittedFeedback(true);
      }
    }
  }

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