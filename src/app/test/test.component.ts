import { Component } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  projects = [
    { name: 'About InterActia?', questions: [
      { text: 'Contact Details?', subQuestions: [
        { text: 'Where is it located?', answer: 'Rupayan Shelford (20th Floor), 23/6, Mirpur Road, Shyamoli, Dhaka-1207, Bangladesh.' },
        { text: 'What is the contact numbers?', answer: 'Phone: +880-2-58151538, +880-2-58151542, +880-2-48121377, +880-2-48115029. Email: info@datasoft-bd.com' }
      ]},
      { text: 'Who is involved?', subQuestions: [
        { text: 'Who is the lead?', answer: 'The lead is Arnab Sen' },
        { text: 'Who are the developers?', answer: 'The developers are...' }
      ]}
    ]},
    { name: 'Know About Running Project?', questions: [
      { text: 'What is Project B?', subQuestions: [
        { text: 'What problem does it solve?', answer: 'It solves...' },
        { text: 'Who benefits from it?', answer: 'The beneficiaries are...' }
      ]},
      { text: 'Who is leading?', subQuestions: [
        { text: 'Who is the project manager?', answer: 'The project manager is ABC' },
        { text: 'Who are the stakeholders?', answer: 'The stakeholders are...' }
      ]}
    ]},
    { name: 'Our Services', questions: [
      { text: 'Service we provide', subQuestions: [
        { text: 'Core Competencies', answer: 'Software Development, Software Testing, IT Infrastructure Establishment, System Management and Implementation' },
        { text: 'Full Cycle Development Services', answer: 'BUSINESS ANALYSIS, UX/UI DEVELOPMENT, TESTING AND QA, DEVELOPMENT, DEPLOYMENT, DATA MANAGEMENT.' }
      ]},
      { text: 'Our served products', subQuestions: [
        { text: 'Banking Products', answer: 'Agent Banking and Banking Solutions of AB Bank, Metlife, Bkash etc.' },
        { text: 'Govt. Projects', answer: 'Metro Rail, Rapid Pass, CTG Port.' }
      ]}
    ]},
    { name: 'Technologies We Use', questions: [
      { text: 'Service we provide', subQuestions: [
        { text: 'Core Competencies', answer: 'Software Development, Software Testing, IT Infrastructure Establishment, System Management and Implementation' },
        { text: 'Full Cycle Development Services', answer: 'BUSINESS ANALYSIS, UX/UI DEVELOPMENT, TESTING AND QA, DEVELOPMENT, DEPLOYMENT, DATA MANAGEMENT.' }
      ]},
      { text: 'Our served products', subQuestions: [
        { text: 'Banking Products', answer: 'Agent Banking and Banking Solutions of AB Bank, Metlife, Bkash etc.' },
        { text: 'Govt. Projects', answer: 'Metro Rail, Rapid Pass, CTG Port.' }
      ]}
    ]}
  ];
  
  selectedProject: any = null;
  selectedQuestion: any = null;
  selectedSubQuestion: any = null;
  chatHistory: { sender: string, text: string }[] = [];

  selectProject(project: any) {
    this.selectedProject = project;
    this.selectedQuestion = null;
    this.selectedSubQuestion = null;
    this.chatHistory.push({ sender: 'user', text: project.name });
    this.chatHistory.push({ sender: 'bot', text: `You selected ${project.name}. Choose a question:` });
  }

  showSubQuestions(question: any) {
    this.selectedQuestion = question;
    this.selectedSubQuestion = null;
    this.chatHistory.push({ sender: 'user', text: question.text });
    this.chatHistory.push({ sender: 'bot', text: `Choose a sub-question:` });
  }

  showAnswer(subQuestion: any) {
    this.selectedSubQuestion = subQuestion;
    this.chatHistory.push({ sender: 'user', text: subQuestion.text });
    this.chatHistory.push({ sender: 'bot', text: subQuestion.answer });
  }

  reset() {
    this.chatHistory.push({ sender: 'user', text: 'Back to project selection' });
    this.selectedProject = null;
    this.selectedQuestion = null;
    this.selectedSubQuestion = null;
  }
}
