# Constitutional Rights Research Platform

A modern web application for searching and exploring U.S. civil rights case law. This platform provides researchers, students, and legal professionals with an intuitive interface to search through court opinions related to civil rights.

## Features

- **Advanced Search**: Search across court opinions with filtering by court, date range, and more
- **User Authentication**: Create an account to save searches and favorite cases
- **Responsive Design**: Fully responsive interface that works on desktop, tablet, and mobile devices
- **Dark Mode**: Toggle between light and dark themes for comfortable reading in any environment
- **Accessibility**: Built with accessibility in mind, following WCAG guidelines
- **Modern UI**: Clean, intuitive interface with smooth animations and transitions

## Technology Stack

- **Frontend**: React, Tailwind CSS, Framer Motion
- **Authentication**: Netlify Identity / Supabase Auth
- **API**: Netlify Functions
- **Data Source**: CourtListener API
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/patriotnewsactivism/updated-civil-rights-tool.git
   cd updated-civil-rights-tool
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Development

### Project Structure

```
/
├── netlify/            # Netlify configuration and functions
│   └── functions/      # Serverless functions
├── public/             # Static assets
├── src/
│   ├── components/     # React components
│   │   ├── ui/         # UI components
│   │   └── ...         # Feature components
│   ├── context/        # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility libraries
│   └── utils/          # Helper functions
├── index.html          # HTML entry point
├── netlify.toml        # Netlify configuration
└── package.json        # Project dependencies and scripts
```

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run format` - Format code with Prettier

## Authentication

The application uses Netlify Identity for authentication. To enable authentication:

1. Deploy the site to Netlify
2. Enable Identity in the Netlify dashboard
3. Configure registration preferences (open or invite-only)

## API Integration

The application uses the CourtListener API to fetch case data. The API is accessed through Netlify Functions to protect API keys and provide a consistent interface.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Data provided by [CourtListener](https://www.courtlistener.com/)
- Built with [React](https://reactjs.org/) and [Tailwind CSS](https://tailwindcss.com/)
- Deployed on [Netlify](https://www.netlify.com/)