import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Home, Tool, Scale, Upload } from "lucide-react";

export default function CaseUpload() {
  const [formData, setFormData] = useState({
    title: '',
    jurisdiction: '',
    court: '',
    citation: '',
    summary: '',
    document_url: '',
    tags: '',
    date_filed: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase
        .from('cases')
        .insert([
          {
            title: formData.title,
            jurisdiction: formData.jurisdiction,
            court: formData.court,
            citation: formData.citation,
            summary: formData.summary,
            document_url: formData.document_url,
            tags: formData.tags.split(',').map(tag => tag.trim()),
            date_filed: formData.date_filed
          }
        ])
        .select();

      if (error) throw error;

      setMessage('Case successfully added to the database!');
      setFormData({
        title: '',
        jurisdiction: '',
        court: '',
        citation: '',
        summary: '',
        document_url: '',
        tags: '',
        date_filed: ''
      });
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-primary-900 to-dark-800 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Navigation */}
        <header className="mb-12">
          <div className="card p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <Scale className="h-10 w-10 text-primary-400 mr-3" />
                <h1 className="text-3xl font-bold constitutional-title">
                  Constitutional Rights Research Platform
                </h1>
              </div>
              <nav className="flex space-x-6">
                <a href="/" className="nav-link flex items-center text-lg">
                  <Home className="h-5 w-5 mr-2" />
                  Home
                </a>
                <a href="/upload" className="nav-link flex items-center text-lg">
                  <Upload className="h-5 w-5 mr-2" />
                  Add Case
                </a>
                <a href="/toolkit" className="nav-link flex items-center text-lg">
                  <Tool className="h-5 w-5 mr-2" />
                  Toolkit
                </a>
              </nav>
            </div>
          </div>
        </header>

        <main>
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold constitutional-title mb-6">
                Add New Civil Rights Case
              </h1>
              <p className="forensic-analysis-text max-w-3xl mx-auto">
                Contribute to our database of civil rights jurisprudence by adding new cases
              </p>
            </div>

            <div className="card p-8">
              {message && (
                <div className={`mb-6 p-4 rounded-lg ${
                  message.includes('Error') 
                    ? 'bg-danger-900/30 border border-danger-700' 
                    : 'bg-success-900/30 border border-success-700'
                }`}>
                  <p className="text-center">{message}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-lg font-medium mb-2">
                    Case Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent focusable"
                    placeholder="Enter case title"
                  />
                </div>

                <div>
                  <label htmlFor="jurisdiction" className="block text-lg font-medium mb-2">
                    Jurisdiction
                  </label>
                  <input
                    type="text"
                    id="jurisdiction"
                    name="jurisdiction"
                    value={formData.jurisdiction}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent focusable"
                    placeholder="Enter jurisdiction (e.g., California, 9th Circuit)"
                  />
                </div>

                <div>
                  <label htmlFor="court" className="block text-lg font-medium mb-2">
                    Court
                  </label>
                  <input
                    type="text"
                    id="court"
                    name="court"
                    value={formData.court}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent focusable"
                    placeholder="Enter court name"
                  />
                </div>

                <div>
                  <label htmlFor="citation" className="block text-lg font-medium mb-2">
                    Citation
                  </label>
                  <input
                    type="text"
                    id="citation"
                    name="citation"
                    value={formData.citation}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent focusable"
                    placeholder="Enter citation (e.g., 123 F. Supp. 3d 456)"
                  />
                </div>

                <div>
                  <label htmlFor="date_filed" className="block text-lg font-medium mb-2">
                    Date Filed
                  </label>
                  <input
                    type="date"
                    id="date_filed"
                    name="date_filed"
                    value={formData.date_filed}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent focusable"
                  />
                </div>

                <div>
                  <label htmlFor="document_url" className="block text-lg font-medium mb-2">
                    Document URL
                  </label>
                  <input
                    type="url"
                    id="document_url"
                    name="document_url"
                    value={formData.document_url}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent focusable"
                    placeholder="Enter document URL (optional)"
                  />
                </div>

                <div>
                  <label htmlFor="tags" className="block text-lg font-medium mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent focusable"
                    placeholder="Enter tags (e.g., First Amendment, Police Conduct, Qualified Immunity)"
                  />
                </div>

                <div>
                  <label htmlFor="summary" className="block text-lg font-medium mb-2">
                    Summary
                  </label>
                  <textarea
                    id="summary"
                    name="summary"
                    value={formData.summary}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-dark-800 border border-dark-600 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent focusable"
                    placeholder="Enter case summary"
                  />
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary px-8 py-4 text-lg"
                  >
                    {loading ? 'Adding Case...' : 'Add Case to Database'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}