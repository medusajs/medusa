import React, { useRef, useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import './index.css';

import useIsBrowser from '@docusaurus/useIsBrowser';
import {useLocation} from '@docusaurus/router';

export default function Feedback () {
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
        window.analytics.track('survey', {
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
                <span>Was this page helpful?</span>
                <button className='positive feedback-btn' onClick={handleFeedback}>Yes</button>
                <button className='negative feedback-btn' onClick={handleFeedback}>No</button>
              </div>
            )}
            {(showForm && !submittedFeedback) && (
              <div className='inline-question' ref={inlineQuestionRef}>
                <span>{positiveFeedback ? 'What was most helpful?' : 'What can we improve?'}</span>
                <textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                <button className='feedback-btn' onClick={submitFeedback} disabled={loading}>Submit</button>
              </div>
            )}
            {submittedFeedback && (
              <div className='feedback-message' ref={inlineMessageRef}>
                Thank you for helping improve our documentation!
              </div>
            )}
          </>
        </CSSTransition>
      </SwitchTransition>
    </div>
  )
}