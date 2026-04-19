import { images } from './assets';

export const initialData = {
  hero: {
    title: "Home",
    greeting: "HELLO THERE, WELCOME TO MY SITE",
    name: "Gowrav",
    lastName: "Munindra",
    rolePrefix: "A",
    role: "Full Stack Developer",
    roleSuffix: "",
    profileImage: images.HomeSection,
    ctaPrimary: "View My Work",
    ctaSecondary: "Get in Touch",
  },
  about: {
    title: "About Me",
    bio: `I’m a passionate web developer specializing in creating modern, visually appealing, and user-friendly websites. As a budding freelancer, I focus on delivering clean, responsive, and high-performance web experiences using React.js and CSS. I work primarily with the MERN stack (MongoDB, Express.js, React.js, Node.js) and leverage modern “vibe coding” tools to build efficient, scalable, and visually engaging applications. Whether you need a stunning frontend interface or a complete full-stack solution, I can adapt to your project requirements and deliver accordingly. I believe in writing clean code, maintaining good UI/UX standards, and building products that not only work well but also look great. My goal is to help clients turn their ideas into functional and impactful digital experiences.`,
  },
  skills: {
    title: "Key Skills",
    desc: "Technologies I use to build the website",
    items: [
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "CSS",
      "Tailwind CSS",
      "HTML",
      "JavaScript",
      "Vibe Coding",
    ]
  },
  FrontendProjects: {
    title: "Frontend Works",
    desc: "Visually appealing frontend experiences mostly SAAS based landing pages.",
    items: [
      {
        id: 1,
        title: "AI Powered Task Manager",
        description: "A high-performance Netflix clone featuring movie categories and preview functionality.",
        link: "https://ai-powered-workflow-manger.vercel.app",
        codeLink: "https://github.com/gowravmunindra/AI-Powered-Workflow-Manger",
        imageUrl: images.HomeSection,
        videoUrl: ""
      },
      {
        id: 2,
        title: "Flow Pilot ",
        description: "A visually immersive VR-inspired web experience designed to simulate interactive workflows in a modern, engaging environment. Built with a focus on smooth animations, creative UI, and an intuitive user journey.",
        link: "https://virtual-reality-sepia.vercel.app",
        codeLink: "https://github.com/gowravmunindra/Virtual_Reality",
        imageUrl: images.Vr,
        videoUrl: ""
      },
      {
        id: 3,
        title: "BMI Calculator ",
        description: "A visually immersive VR-inspired web experience designed to simulate interactive workflows in a modern, engaging environment. Built with a focus on smooth animations, creative UI, and an intuitive user journey.",
        link: "https://bmi-calulator-eight.vercel.app",
        codeLink: "https://github.com/gowravmunindra/BMI_Calulator",
        imageUrl: images.BMI,
        videoUrl: ""
      },
      {
        id: 4,
        title: "Netflix (A clone of Netflix Landing Page) ",
        description: "A pixel-perfect Netflix landing page clone created to replicate the original platform’s design and layout using advanced CSS techniques. Focused on mastering UI design, responsiveness, and real-world styling practices.",
        link: "https://netflix-landing-page-murex.vercel.app",
        codeLink: "https://github.com/gowravmunindra/Netflix-landing-Page",
        imageUrl: images.Netflix,
        videoUrl: ""
      },
    ]
  },
  MernStackProjects: {
    title: "MERN Stack Works",
    desc: "Robust full-stack applications consits of all working functionalities",
    items: [
      {
        id: 1,
        title: "Bite Reel",
        description: "A modern and visually engaging web platform that showcases food-related reels with an interactive and aesthetic UI experience. Focused to build as a mobile first application.",
        link: "https://bite-reel-frontend.onrender.com",
        codeLink: "https://github.com/gowravmunindra/Bite-Reel-Application",
        imageUrl: images.BiteReel,
        videoUrl: ""
      },
      {
        id: 2,
        title: "Student Outing System",
        description: "A specialized dashboard for managing and exploring virtual reality content.",
        link: "https://student-outing-system-frontend.onrender.com",
        codeLink: "https://github.com/gowravmunindra/Student_Outing_System",
        imageUrl: images.StudentOutingSystem,
        videoUrl: ""
      }
    ]
  },
  contact: {
    title: "Get In Touch",
    desc: "Open to collaborations, freelance work and exciting opportunities.",
    email: "gowravmunindra@gmail.com",
    phone: "6300476098",
    github: "https://github.com/gowravmunindra",
    linkedin: "https://www.linkedin.com/in/gowrav-munindra-76a057224/",
  },
  layout: [
    { id: 'hero', visible: true, locked: true },
    { id: 'about', visible: true, locked: false },
    { id: 'skills', visible: true, locked: false },
    { id: 'FrontendProjects', visible: true, locked: false, navLabel: 'Frontend' },
    { id: 'MernStackProjects', visible: true, locked: false, navLabel: 'MERN Stack' },
    { id: 'contact', visible: true, locked: false }
  ]
};
