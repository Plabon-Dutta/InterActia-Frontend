import { Component, Input, ChangeDetectorRef, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS, createEventId } from '../event-utils';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  @Input()
  Name: string = "Plabon";
  @Input()
  Email: string = "plabon@gmail.com";

  // Calendar Part Starts
  calendarVisible = true;
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'title',
      center: '',
      // right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      right: 'today prev,next'
    },
    initialView: 'dayGridMonth',
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  };
  currentEvents: EventApi[] = [];

  constructor(private changeDetector: ChangeDetectorRef) {
  }

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible;
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this;
    calendarOptions.weekends = !calendarOptions.weekends;
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const title = prompt('Please enter a new title for your event');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      });
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents = events;
    this.changeDetector.detectChanges();
  }

  // chatbot part starts here

  @ViewChild('chatBox') chatBox!: ElementRef;

  questions: string[] = [
    "What are your working hours?",
    "How can I contact support?",
    "Do you offer refunds?",
    "What is the address?",
    "Contact Numbers?"
  ];

  answers: string[] = [
    "Our working hours are from 9:30 AM to 6:30 PM, Sunday to Thursday.",
    "You can contact our support via email at info@datasoft-bd.com or call us at +880-2-48115029, +880-2-58151542, +880-2-48121377.",
    "Yes, we offer refunds within 30 days of purchase. Please check our refund policy.",
    "Building: Rupayan Shelford (20th Floor) Area: Mirpur Road, Shyamoli  City: Dhaka  Country: Bangladesh",
    "call us at +880-2-48115029, +880-2-58151542, +880-2-48121377."
  ];

  chatMessages: { text: string, type: 'question' | 'response' }[] = [];

  private isAtBottom = true; // Track if user is at the bottom

  showAnswer(index: number) {
    this.chatMessages.push({ text: this.questions[index], type: 'question' });
    this.chatMessages.push({ text: this.answers[index], type: 'response' });

    this.scrollToBottom();
  }

  // Scroll to the bottom if the user is at the bottom before new message
  scrollToBottom() {
    setTimeout(() => {
      if (this.chatBox) {
        this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
      }
    }, 100);
  }

  // Detect user scroll
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    this.isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // User is at bottom
  }

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

  showAnswer2(subQuestion: any) {
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
