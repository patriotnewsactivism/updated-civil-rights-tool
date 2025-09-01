import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  Upload, 
  Calendar, 
  MapPin, 
  BookOpen, 
  Tag, 
  FileText, 
  Link as LinkIcon, 
  AlertTriangle,
  CheckCircle,
  X,
  Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const CaseUploadPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      // Process tags from comma-separated string to array
      const processedTags = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      // Format the data for Supabase
      const caseData = {
        title: data.title,
        citation: data.citation,
        court: data.court,
        jurisdiction: data.jurisdiction,
        date_filed: data.date_filed,
        summary: data.summary,
        document_url: data.document_url,
        tags: processedTags,
        user_id: user?.id || null,
        created_at: new Date()
      };
      
      // Insert into Supabase
      const { error: supabaseError } = await supabase
        .from('cases')
        .insert([caseData]);
      
      if (supabaseError) throw supabaseError;
      
      // Show success message and reset form
      setSuccess(true);
      reset();
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
      
    } catch (err) {
      console.error('Error submitting case:', err);
      setError(err.message || 'An error occurred while submitting the case.');
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="container mx-auto px-4 py-8"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Submit a Case</h1>
        <p className="text-gray-400">
          Contribute to our database of civil rights jurisprudence by adding new cases
        </p>
      </motion.div>

      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 p-4 bg-success-900/30 border border-success-700/50 rounded-lg flex items-start"
        >
          <CheckCircle className="h-5 w-5 text-success-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-success-400 mb-1">Case Successfully Submitted</h3>
            <p className="text-gray-300 text-sm">
              Thank you for your contribution to the Constitutional Rights Research Platform.
            </p>
          </div>
          <button 
            onClick={() => setSuccess(false)}
            className="ml-auto text-gray-400 hover:text-white"
            aria-label="Dismiss"
          >
            <X className="h-5 w-5" />
          </button>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 p-4 bg-danger-900/30 border border-danger-700/50 rounded-lg flex items-start"
        >
          <AlertTriangle className="h-5 w-5 text-danger-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-danger-400 mb-1">Error Submitting Case</h3>
            <p className="text-gray-300 text-sm">{error}</p>
          </div>
          <button 
            onClick={() => setError(null)}
            className="ml-auto text-gray-400 hover:text-white"
            aria-label="Dismiss"
          >
            <X className="h-5 w-5" />
          </button>
        </motion.div>
      )}

      {/* Case Upload Form */}
      <motion.div 
        variants={itemVariants}
        className="bg-dark-800/50 backdrop-blur-sm rounded-xl p-6 border border-dark-700"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Case Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
              Case Title <span className="text-danger-500">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <input
                id="title"
                type="text"
                placeholder="e.g. NAACP v. Alabama"
                className={`w-full pl-10 pr-4 py-3 bg-dark-700 border ${
                  errors.title ? 'border-danger-600' : 'border-dark-600'
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600`}
                {...register('title', { required: 'Case title is required' })}
              />
            </div>
            {errors.title && (
              <p className="mt-1 text-sm text-danger-500">{errors.title.message}</p>
            )}
          </div>

          {/* Citation */}
          <div>
            <label htmlFor="citation" className="block text-sm font-medium text-gray-300 mb-1">
              Citation <span className="text-danger-500">*</span>
            </label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <input
                id="citation"
                type="text"
                placeholder="e.g. 357 U.S. 449 (1958)"
                className={`w-full pl-10 pr-4 py-3 bg-dark-700 border ${
                  errors.citation ? 'border-danger-600' : 'border-dark-600'
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600`}
                {...register('citation', { required: 'Citation is required' })}
              />
            </div>
            {errors.citation && (
              <p className="mt-1 text-sm text-danger-500">{errors.citation.message}</p>
            )}
          </div>

          {/* Court and Jurisdiction - Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Court */}
            <div>
              <label htmlFor="court" className="block text-sm font-medium text-gray-300 mb-1">
                Court <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <Gavel className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <select
                  id="court"
                  className={`w-full pl-10 pr-4 py-3 bg-dark-700 border ${
                    errors.court ? 'border-danger-600' : 'border-dark-600'
                  } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600`}
                  {...register('court', { required: 'Court is required' })}
                >
                  <option value="">Select Court</option>
                  <option value="Supreme Court">Supreme Court</option>
                  <option value="1st Circuit">1st Circuit Court of Appeals</option>
                  <option value="2nd Circuit">2nd Circuit Court of Appeals</option>
                  <option value="3rd Circuit">3rd Circuit Court of Appeals</option>
                  <option value="4th Circuit">4th Circuit Court of Appeals</option>
                  <option value="5th Circuit">5th Circuit Court of Appeals</option>
                  <option value="6th Circuit">6th Circuit Court of Appeals</option>
                  <option value="7th Circuit">7th Circuit Court of Appeals</option>
                  <option value="8th Circuit">8th Circuit Court of Appeals</option>
                  <option value="9th Circuit">9th Circuit Court of Appeals</option>
                  <option value="10th Circuit">10th Circuit Court of Appeals</option>
                  <option value="11th Circuit">11th Circuit Court of Appeals</option>
                  <option value="D.C. Circuit">D.C. Circuit Court of Appeals</option>
                  <option value="Federal Circuit">Federal Circuit Court of Appeals</option>
                  <option value="District Court">U.S. District Court</option>
                  <option value="State Supreme Court">State Supreme Court</option>
                  <option value="State Appellate Court">State Appellate Court</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {errors.court && (
                <p className="mt-1 text-sm text-danger-500">{errors.court.message}</p>
              )}
            </div>

            {/* Jurisdiction */}
            <div>
              <label htmlFor="jurisdiction" className="block text-sm font-medium text-gray-300 mb-1">
                Jurisdiction <span className="text-danger-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                <select
                  id="jurisdiction"
                  className={`w-full pl-10 pr-4 py-3 bg-dark-700 border ${
                    errors.jurisdiction ? 'border-danger-600' : 'border-dark-600'
                  } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600`}
                  {...register('jurisdiction', { required: 'Jurisdiction is required' })}
                >
                  <option value="">Select Jurisdiction</option>
                  <option value="Federal">Federal</option>
                  <option value="AL">Alabama</option>
                  <option value="AK">Alaska</option>
                  <option value="AZ">Arizona</option>
                  <option value="AR">Arkansas</option>
                  <option value="CA">California</option>
                  <option value="CO">Colorado</option>
                  <option value="CT">Connecticut</option>
                  <option value="DE">Delaware</option>
                  <option value="FL">Florida</option>
                  <option value="GA">Georgia</option>
                  <option value="HI">Hawaii</option>
                  <option value="ID">Idaho</option>
                  <option value="IL">Illinois</option>
                  <option value="IN">Indiana</option>
                  <option value="IA">Iowa</option>
                  <option value="KS">Kansas</option>
                  <option value="KY">Kentucky</option>
                  <option value="LA">Louisiana</option>
                  <option value="ME">Maine</option>
                  <option value="MD">Maryland</option>
                  <option value="MA">Massachusetts</option>
                  <option value="MI">Michigan</option>
                  <option value="MN">Minnesota</option>
                  <option value="MS">Mississippi</option>
                  <option value="MO">Missouri</option>
                  <option value="MT">Montana</option>
                  <option value="NE">Nebraska</option>
                  <option value="NV">Nevada</option>
                  <option value="NH">New Hampshire</option>
                  <option value="NJ">New Jersey</option>
                  <option value="NM">New Mexico</option>
                  <option value="NY">New York</option>
                  <option value="NC">North Carolina</option>
                  <option value="ND">North Dakota</option>
                  <option value="OH">Ohio</option>
                  <option value="OK">Oklahoma</option>
                  <option value="OR">Oregon</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="RI">Rhode Island</option>
                  <option value="SC">South Carolina</option>
                  <option value="SD">South Dakota</option>
                  <option value="TN">Tennessee</option>
                  <option value="TX">Texas</option>
                  <option value="UT">Utah</option>
                  <option value="VT">Vermont</option>
                  <option value="VA">Virginia</option>
                  <option value="WA">Washington</option>
                  <option value="WV">West Virginia</option>
                  <option value="WI">Wisconsin</option>
                  <option value="WY">Wyoming</option>
                  <option value="DC">District of Columbia</option>
                  <option value="PR">Puerto Rico</option>
                  <option value="VI">U.S. Virgin Islands</option>
                  <option value="GU">Guam</option>
                  <option value="AS">American Samoa</option>
                  <option value="MP">Northern Mariana Islands</option>
                </select>
              </div>
              {errors.jurisdiction && (
                <p className="mt-1 text-sm text-danger-500">{errors.jurisdiction.message}</p>
              )}
            </div>
          </div>

          {/* Date Filed */}
          <div>
            <label htmlFor="date_filed" className="block text-sm font-medium text-gray-300 mb-1">
              Date Filed <span className="text-danger-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <input
                id="date_filed"
                type="date"
                className={`w-full pl-10 pr-4 py-3 bg-dark-700 border ${
                  errors.date_filed ? 'border-danger-600' : 'border-dark-600'
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600`}
                {...register('date_filed', { required: 'Date filed is required' })}
              />
            </div>
            {errors.date_filed && (
              <p className="mt-1 text-sm text-danger-500">{errors.date_filed.message}</p>
            )}
          </div>

          {/* Summary */}
          <div>
            <label htmlFor="summary" className="block text-sm font-medium text-gray-300 mb-1">
              Summary <span className="text-danger-500">*</span>
            </label>
            <textarea
              id="summary"
              rows="4"
              placeholder="Provide a brief summary of the case and its constitutional significance..."
              className={`w-full px-4 py-3 bg-dark-700 border ${
                errors.summary ? 'border-danger-600' : 'border-dark-600'
              } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600`}
              {...register('summary', { 
                required: 'Summary is required',
                minLength: { value: 50, message: 'Summary should be at least 50 characters' }
              })}
            ></textarea>
            {errors.summary && (
              <p className="mt-1 text-sm text-danger-500">{errors.summary.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Minimum 50 characters. Include key holdings and constitutional implications.
            </p>
          </div>

          {/* Document URL */}
          <div>
            <label htmlFor="document_url" className="block text-sm font-medium text-gray-300 mb-1">
              Document URL
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <input
                id="document_url"
                type="url"
                placeholder="https://www.example.com/case-document"
                className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600"
                {...register('document_url', { 
                  pattern: {
                    value: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
                    message: 'Please enter a valid URL'
                  }
                })}
              />
            </div>
            {errors.document_url && (
              <p className="mt-1 text-sm text-danger-500">{errors.document_url.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Link to official court document, legal database, or reliable source.
            </p>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
              Tags <span className="text-danger-500">*</span>
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              <input
                id="tags"
                type="text"
                placeholder="First Amendment, Freedom of Speech, Protest Rights"
                className={`w-full pl-10 pr-4 py-3 bg-dark-700 border ${
                  errors.tags ? 'border-danger-600' : 'border-dark-600'
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-600`}
                {...register('tags', { required: 'At least one tag is required' })}
              />
            </div>
            {errors.tags && (
              <p className="mt-1 text-sm text-danger-500">{errors.tags.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Comma-separated list of relevant constitutional issues and legal concepts.
            </p>
          </div>

          {/* Legal Disclaimer */}
          <div className="p-4 bg-dark-900/50 rounded-lg border border-dark-700">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-warning-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-warning-400 mb-1">Legal Disclaimer</h3>
                <p className="text-xs text-gray-400">
                  By submitting this case, you confirm that the information provided is accurate to the best of your knowledge and comes from reliable legal sources.
                  This platform is for educational and research purposes only. Case submissions are reviewed for accuracy before publication.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-900 disabled:cursor-not-allowed text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  Submit Case
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Additional Information */}
      <motion.div 
        variants={itemVariants}
        className="mt-8 bg-dark-800/50 backdrop-blur-sm rounded-xl p-6 border border-dark-700"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Submission Guidelines</h2>
        <ul className="space-y-2 text-gray-400">
          <li className="flex items-start">
            <div className="mr-3 mt-0.5 text-primary-400">•</div>
            <p>Focus on cases with significant constitutional implications, particularly those affecting civil rights.</p>
          </li>
          <li className="flex items-start">
            <div className="mr-3 mt-0.5 text-primary-400">•</div>
            <p>Include accurate citation information following standard legal citation format.</p>
          </li>
          <li className="flex items-start">
            <div className="mr-3 mt-0.5 text-primary-400">•</div>
            <p>Provide a concise but comprehensive summary highlighting key holdings and constitutional principles.</p>
          </li>
          <li className="flex items-start">
            <div className="mr-3 mt-0.5 text-primary-400">•</div>
            <p>Use specific tags to categorize the case by relevant constitutional amendments and legal concepts.</p>
          </li>
          <li className="flex items-start">
            <div className="mr-3 mt-0.5 text-primary-400">•</div>
            <p>Link to official court documents or reliable legal databases whenever possible.</p>
          </li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default CaseUploadPage;