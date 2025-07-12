import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Link } from 'react-router-dom';

const QuestionList = ({ token, user }) => {
  const [questions, setQuestions] = useState([]);
  const [answerContent, setAnswerContent] = useState({});

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/questions');
      setQuestions(res.data);
    } catch (err) {
      console.error('Failed to fetch questions');
    }
  };

  const postAnswer = async (questionId) => {
    const content = answerContent[questionId] || '';
    if (!content) return alert('Answer cannot be empty');
    try {
      await axios.post(
        `http://localhost:5000/api/answers/${questionId}`,
        { content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnswerContent({ ...answerContent, [questionId]: '' });
      fetchQuestions();
    } catch (err) {
      alert('Failed to post answer');
    }
  };

  const vote = async (answerId, voteType) => {
    try {
      await axios.post(
        `http://localhost:5000/api/answers/${answerId}/vote`,
        { vote_type: voteType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchQuestions();
    } catch (err) {
      alert('Failed to vote');
    }
  };

  const acceptAnswer = async (answerId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/answers/${answerId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchQuestions();
    } catch (err) {
      alert('Failed to accept answer');
    }
  };

  const deleteQuestion = async (questionId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/question/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchQuestions();
    } catch (err) {
      alert('Failed to delete question');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-soDarkGray">All Questions</h1>
        <Link to="/ask" className="btn-so">Ask Question</Link>
      </div>
      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="flex border-b border-soGray py-4">
            <div className="w-24 text-center">
              <div className="text-sm text-soDarkGray">{q.votes || 0} votes</div>
              <div className={`text-sm ${q.answers?.length > 0 ? 'text-green-600' : 'text-soDarkGray'}`}>
                {q.answers?.length || 0} answers
              </div>
            </div>
            <div className="flex-1">
              <Link to={`/question/${q.id}`} className="text-soBlue text-base font-medium hover:underline">
                {q.title}
              </Link>
              <div className="text-sm text-soDarkGray mt-1" dangerouslySetInnerHTML={{ __html: q.description.substring(0, 150) + '...' }} />
              <div className="flex items-center mt-2">
                <div className="flex space-x-1">
                  {q.tags?.split(',').map((tag, i) => (
                    <span key={i} className="tag">{tag.trim()}</span>
                  ))}
                </div>
                <span className="text-xs text-soDarkGray ml-4">Asked by {q.username}</span>
                {user?.role === 'admin' && (
                  <button
                    onClick={() => deleteQuestion(q.id)}
                    className="text-red-500 hover:underline text-xs ml-4"
                  >
                    Delete
                  </button>
                )}
              </div>
              {token && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-soDarkGray mb-2">Your Answer</h3>
                  <CKEditor
                    editor={ClassicEditor}
                    data={answerContent[q.id] || ''}
                    onChange={(event, editor) => {
                      setAnswerContent({ ...answerContent, [q.id]: editor.getData() });
                    }}
                    config={{
                      toolbar: ['bold', 'italic', 'strikethrough', 'bulletedList', 'numberedList', 'link', 'alignment'],
                    }}
                  />
                  <button
                    onClick={() => postAnswer(q.id)}
                    className="btn-so mt-2"
                  >
                    Post Your Answer
                  </button>
                </div>
              )}
              {q.answers?.map((a) => (
                <div key={a.id} className="mt-4 border-t border-soGray pt-4">
                  <div dangerouslySetInnerHTML={{ __html: a.content }} className="text-sm text-soDarkGray" />
                  <div className="flex items-center mt-2">
                    <span className="text-xs text-soDarkGray">Votes: {a.votes} {a.is_accepted && <span className="text-green-600">(Accepted)</span>}</span>
                    {token && (
                      <div className="space-x-2 ml-4">
                        <button
                          onClick={() => vote(a.id, 'upvote')}
                          className="text-soBlue hover:underline text-xs"
                        >
                          Upvote
                        </button>
                        <button
                          onClick={() => vote(a.id, 'downvote')}
                          className="text-soBlue hover:underline text-xs"
                        >
                          Downvote
                        </button>
                        {user?.id === q.user_id && !a.is_accepted && (
                          <button
                            onClick={() => acceptAnswer(a.id)}
                            className="text-green-600 hover:underline text-xs"
                          >
                            Accept
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionList;