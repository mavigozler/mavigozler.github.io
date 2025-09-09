import type { Editor as TinyMCEEditor } from 'tinymce';
import React, { useRef, useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import axios from 'axios';

function App() {
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const [title, setTitle] = useState('');

  const handleSave = () => {
    const content = editorRef.current && editorRef.current.getContent();
    axios.post('http://localhost:5000/api/save-question', { title, content })
      .then(res => alert(res.data.status))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div>
      <h2>Create Test Question</h2>
      <input
        type = "text"
        placeholder = "Question Title"
        value = {title}
        onChange = {e => setTitle(e.target.value)}
      />
      <Editor
        onInit = {(evt, editor) => editorRef.current = editor}
        initialValue = "<p>Type your question here. Use \\(x^2\\) for inline LaTeX.</p>"
        init = {{
          height: 400,
          menubar: false,
          plugins: ['code', 'link', 'lists'],
          toolbar: 'undo redo | bold italic | code | bullist numlist',
          content_style: 'body { font-family:Helvetica; font-size:14px }'
        }}
      />
      <button onClick = {handleSave}>Save to YAML</button>
    </div>
  );
}

export default App;
