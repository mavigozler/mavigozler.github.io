"use strict";
const MathJax = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']]
    }
};
// Function to render the questions from the parsed YAML data
function renderQuestions(data) {
    const container = document.getElementById('rendered-questions');
    container.innerHTML = ''; // Clear previous content
    if (!data || data.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center text-lg mt-8">No questions to display.</p>';
        return;
    }
    data.forEach((item, index) => {
        const questionHtml = `
            <div class="bg-white p-6 rounded-lg shadow-md mb-6 ${index > 0 ? 'page-break' : ''}">
               <h2 class="text-xl font-semibold text-gray-800 mb-4">Question ${index + 1}</h2>
               <div class="mb-4">
                     <p>${item.question}</p>
               </div>
               <ul class="space-y-2 text-gray-700">
                     ${item.options.map(option => `
                        <li class="p-3 border border-gray-200 rounded-lg">${option}</li>
                     `).join('')}
               </ul>
            </div>
         `;
        container.innerHTML += questionHtml;
    });
    // Re-render MathJax after adding new content
    if (window.MathJax) {
        window.MathJax.typesetPromise();
    }
}
// Event listener for the "Generate PDF" button
document.getElementById('generatePdfBtn').addEventListener('click', () => {
    window.print();
});
// Main logic to parse YAML and render
document.addEventListener('DOMContentLoaded', () => {
    try {
        const questions = jsyaml.load(yamlData);
        renderQuestions(questions);
    }
    catch (e) {
        console.error("Failed to parse YAML:", e);
        const container = document.getElementById('questions-container');
        container.innerHTML = `<p class="text-red-500 text-center text-lg mt-8">Error loading questions. Please check the YAML format.</p>`;
    }
});
