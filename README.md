# Constitutional Rights Research Platform

A comprehensive platform for researching civil rights protections across different jurisdictions in the United States. This application provides tools for analyzing constitutional rights, case law, and jurisdictional variations.

## Features

- **Jurisdictional Analysis**: Examine constitutional protections across different federal circuits
- **Legal Toolkit**: Access tools for understanding Stop and ID laws, public records requests, and constitutional rights
- **Case Database**: Search and contribute to a database of civil rights cases
- **Interactive Resources**: Visual maps, charts, and guides for constitutional rights research

## Getting Started

### Prerequisites

- Node.js 20.x or later
- npm 9.x or later

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/patriotnewsactivism/civil-rights-tool.git
   cd civil-rights-tool
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Building for Production

To build the app for production:

```
npm run build
```

This creates an optimized production build in the `build` folder.

## Deployment

This application is configured for deployment on Netlify. The `netlify.toml` file contains the necessary configuration.

### Deploying to Netlify

1. Push your changes to GitHub
2. Connect your GitHub repository to Netlify
3. Configure the build settings:
   - Build command: `npm ci && npm run build`
   - Publish directory: `build`

## Project Structure

```
civil-rights-tool/
├── public/               # Static files
├── src/                  # Source code
│   ├── components/       # Reusable components
│   │   ├── layout/       # Layout components
│   │   ├── ui/           # UI components
│   │   └── ...
│   ├── pages/            # Page components
│   │   ├── home/         # Home page
│   │   ├── search/       # Search page
│   │   ├── case/         # Case pages
│   │   └── toolkit/      # Toolkit pages
│   ├── context/          # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── lib/              # Library code
│   ├── assets/           # Assets (images, icons)
│   ├── App.js            # Main App component
│   ├── App.css           # App styles
│   ├── index.js          # Entry point
│   └── index.css         # Global styles
├── package.json          # Dependencies and scripts
├── netlify.toml          # Netlify configuration
└── README.md             # Project documentation
```

## Key Technologies

- **React**: UI library
- **React Router**: Navigation and routing
- **Tailwind CSS**: Styling
- **Framer Motion**: Animations
- **Lucide React**: Icons
- **Supabase**: Backend database

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Legal Disclaimer

This platform is provided for educational and informational purposes only and does not constitute legal advice. Constitutional law varies by jurisdiction and changes over time. Always consult with a qualified attorney for specific legal guidance tailored to your situation.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please contact [your-email@example.com](mailto:your-email@example.com).