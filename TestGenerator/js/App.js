"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const tinymce_react_1 = require("@tinymce/tinymce-react");
const axios_1 = __importDefault(require("axios"));
function App() {
    const editorRef = (0, react_1.useRef)(null);
    const [title, setTitle] = (0, react_1.useState)('');
    const handleSave = () => {
        const content = editorRef.current && editorRef.current.getContent();
        axios_1.default.post('http://localhost:5000/api/save-question', { title, content })
            .then(res => alert(res.data.status))
            .catch(err => console.error(err));
    };
    (0, react_1.useEffect)(() => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
        script.async = true;
        document.body.appendChild(script);
    }, []);
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { children: "Create Test Question" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Question Title", value: title, onChange: e => setTitle(e.target.value) }), (0, jsx_runtime_1.jsx)(tinymce_react_1.Editor, { onInit: (evt, editor) => editorRef.current = editor, initialValue: "<p>Type your question here. Use \\(x^2\\) for inline LaTeX.</p>", init: {
                    height: 400,
                    menubar: false,
                    plugins: ['code', 'link', 'lists'],
                    toolbar: 'undo redo | bold italic | code | bullist numlist',
                    content_style: 'body { font-family:Helvetica; font-size:14px }'
                } }), (0, jsx_runtime_1.jsx)("button", { onClick: handleSave, children: "Save to YAML" })] }));
}
exports.default = App;
//# sourceMappingURL=App.js.map