import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';

const QuestionForm = ({ token }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/questions',
        { title, description, tags: tags.split(',').map(t => t.trim()) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/');
    } catch (err) {
      alert('Failed to post question');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded border border-soGray mt-4 shadow-sm">
      <h2 className="text-lg font-bold text-soDarkGray mb-4">Ask a public question</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-soDarkGray mb-1">Title</label>
          <input
            type="text"
            placeholder="Be specific and imagine you're asking a question to another person"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-soGray rounded text-sm focus:outline-none focus:ring-2 focus:ring-soBlue"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-soDarkGray mb-1">Body</label>
          <CKEditor
            editor={ClassicEditor}
            data={description}
            onChange={(event, editor) => setDescription(editor.getData())}
            config={{
              toolbar: ['bold', 'italic', 'strikethrough', 'bulletedList', 'numberedList', 'link', 'alignment'],
            }}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-soDarkGray mb-1">Tags</label>
          <input
            type="text"
            placeholder="Add up to 5 tags (comma-separated, e.g., react, javascript)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-2 border border-soGray rounded text-sm focus:outline-none focus:ring-2 focus:ring-soBlue"
          />
        </div>
        <button type="submit" className="btn-so">Post your question</button>
      </form>
    </div>
  );
};

export default QuestionForm;