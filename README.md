# Project Management Kanban Board

A modern, responsive project management application built with Next.js 15, featuring an intuitive Kanban board interface for organizing tasks and projects. This application provides a complete workflow management solution with automated CI/CD pipelines.

![Project Management Kanban](https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## ✨ Features

### 🎯 Core Functionality
- **Multi-Project Management**: Create and manage multiple projects with dedicated Kanban boards
- **Kanban Workflow**: Four-column workflow (To Do → In Progress → Review → Done)
- **Task Management**: Create, edit, delete, and move tasks between columns
- **Smart Task Transitions**: Automated workflow with intelligent task movement
- **Priority System**: Low, Medium, High priority levels with visual indicators
- **Assignment System**: Assign tasks to team members with predefined roles
- **Due Date Tracking**: Set and track task deadlines
- **Review Process**: Built-in approval workflow for completed tasks

### 🎨 User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Smooth Animations**: Powered by Motion (motion.dev) for fluid interactions
- **Modern UI**: Clean, professional interface using Tailwind CSS
- **Intuitive Navigation**: Easy project switching and task management
- **Visual Feedback**: Real-time updates and status indicators

### 🔧 Developer Experience
- **TypeScript**: Full type safety throughout the application
- **Modern Stack**: Built with Next.js 15 App Router
- **Code Quality**: Biome for consistent formatting and linting
- **Automated Workflows**: GitHub Actions for CI/CD
- **Version Management**: Automated semantic versioning

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project-management-kanban
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # React components
│   └── home.tsx          # Main Kanban board component
├── .github/              # GitHub Actions workflows
│   └── workflows/        # CI/CD automation
├── scripts/              # Utility scripts
├── public/               # Static assets
└── package.json          # Project configuration
```

## 🛠️ Technology Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library with latest features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Motion](https://motion.dev/)** - Animation library for React

### Development Tools
- **[Biome](https://biomejs.dev/)** - Fast formatter and linter
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library

### Automation
- **GitHub Actions** - CI/CD pipelines
- **Automated Versioning** - Semantic version management
- **Package Validation** - Dependency and build testing

## 📋 Usage Guide

### Creating Projects
1. Click "New Project" on the main dashboard
2. Enter project name and description
3. Your project will be created with a default Kanban board

### Managing Tasks
1. **Add Tasks**: Click "Add Task" and fill in the details
2. **Move Tasks**: Use action buttons or drag between columns
3. **Edit Tasks**: Click on tasks to modify details
4. **Delete Tasks**: Use the trash icon to remove tasks

### Workflow Process
1. **To Do**: New tasks start here
2. **In Progress**: Click "Start" to begin work
3. **Review**: Complete tasks move here for approval
4. **Done**: Approved tasks are moved to completion

### Task Properties
- **Title & Description**: Basic task information
- **Assignee**: Team member responsible
- **Due Date**: Task deadline
- **Priority**: Low, Medium, or High
- **Status**: Automatically managed by workflow

## 🔄 GitHub Actions Workflows

### Automated Version Management
- **Version Bump**: Automatic versioning based on commit messages
- **Interactive Versioning**: Manual version control with custom inputs
- **PR Analysis**: Intelligent version impact analysis
- **Package Validation**: Dependency and build testing

### Workflow Triggers
- **Push to main**: Automatic version bump and release
- **Manual dispatch**: Interactive version control
- **Pull requests**: Impact analysis and validation
- **Package changes**: Validation and testing

## 📝 Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run linting (Next.js built-in)

# Code Quality
npx biome check      # Check code formatting and linting
npx biome format     # Format code
```

## 🎨 Customization

### Styling
- Modify `app/globals.css` for global styles
- Update Tailwind configuration in `tailwind.config.js`
- Customize color schemes and spacing

### Workflow Columns
- Edit `DEFAULT_COLUMNS` in `components/home.tsx`
- Add or remove workflow stages
- Customize column behavior

### Task Properties
- Extend the `Task` interface for additional fields
- Add new form inputs in the task creation modal
- Update task display components

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically with each push

### Other Platforms
- **Netlify**: Configure build command as `npm run build`
- **Railway**: Use the provided `Dockerfile` if available
- **Docker**: Build and deploy using containerization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow TypeScript best practices
- Use Biome for formatting and linting
- Write descriptive commit messages
- Add tests for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Patrick Annang**
- GitHub: [@amartey-tricky](https://github.com/amartey-tricky)
- Email: trickya23@outlook.com

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) team for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first approach
- [Motion](https://motion.dev/) for smooth animations
- [Lucide](https://lucide.dev/) for beautiful icons
- [Vercel](https://vercel.com/) for seamless deployment

## 📊 Project Status

- ✅ Core Kanban functionality
- ✅ Project management
- ✅ Task workflow automation
- ✅ Responsive design
- ✅ GitHub Actions CI/CD
- 🔄 Authentication system (planned)
- 🔄 Database persistence (planned)
- 🔄 Real-time collaboration (planned)

---

<div align="center">
  <p>Built with ❤️ using Next.js and TypeScript</p>
  <p>
    <a href="#-features">Features</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-usage-guide">Usage</a> •
    <a href="#-contributing">Contributing</a>
  </p>
</div>