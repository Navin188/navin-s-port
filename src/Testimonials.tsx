import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Quote, Star, Plus, X, CheckCircle, AlertCircle, Award } from 'lucide-react';
import {
  fetchApprovedTestimonialsFromDB,
  createTestimonialInDB,
  type TestimonialRecord,
} from './services/supabaseService';
import './Testimonials.css';

gsap.registerPlugin(ScrollTrigger);

// Initial fallback sample data (displayed if database is empty or pending credentials)
const defaultSampleTestimonials: TestimonialRecord[] = [
  {
    id: 'sample-1',
    name: 'Sarah Jenkins',
    role: 'Lead Product Manager',
    company: 'FinTech Labs',
    message:
      'Navin delivers clean, high-performance React frontend architectures with exceptional attention to UX detail and micro-interactions.',
    rating: 5,
    status: 'approved',
  },
  {
    id: 'sample-2',
    name: 'Rahul Verma',
    role: 'Senior Engineering Manager',
    company: 'Shaurya Technosoft',
    message:
      'An extraordinary frontend engineer. Navin optimized our enterprise dashboard load time by over 60% while building reusable UI component libraries.',
    rating: 5,
    status: 'approved',
  },
  {
    id: 'sample-3',
    name: 'Amit Sharma',
    role: 'Founder & CEO',
    company: 'NexGate ERP',
    message:
      'Pixel-perfect component quality and brilliant responsive layouts. Working with Navin was an absolute delight for our entire product team.',
    rating: 5,
    status: 'approved',
  },
];

export const Testimonials = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [testimonials, setTestimonials] = useState<TestimonialRecord[]>(defaultSampleTestimonials);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    message: '',
    rating: 5,
  });

  // Load Approved Testimonials from Supabase
  const loadApprovedTestimonials = async () => {
    setLoading(true);
    const { data, error } = await fetchApprovedTestimonialsFromDB();
    if (!error && data && data.length > 0) {
      setTestimonials(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadApprovedTestimonials();
  }, []);

  // GSAP ScrollTrigger Entrance Reveal
  useEffect(() => {
    if (sectionRef.current) {
      const header = sectionRef.current.querySelector('.testimonials-header');
      const grid = sectionRef.current.querySelector('.testimonials-grid');
      if (header) {
        gsap.fromTo(
          header,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
          }
        );
      }
      if (grid) {
        gsap.fromTo(
          grid,
          { y: 50, opacity: 0, scale: 0.97 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            delay: 0.15,
            ease: 'power3.out',
            scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
          }
        );
      }
    }
  }, []);

  const handleOpenModal = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (submitting) return;
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!formData.name.trim()) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (!formData.message.trim()) {
      setErrorMsg('Please write a testimonial message.');
      return;
    }

    setSubmitting(true);

    const { error } = await createTestimonialInDB({
      name: formData.name.trim(),
      role: formData.role.trim(),
      company: formData.company.trim(),
      message: formData.message.trim(),
      rating: formData.rating,
    });

    setSubmitting(false);

    if (error) {
      setErrorMsg(error);
    } else {
      setSuccessMsg('Thank you! Your testimonial has been submitted and is pending moderation.');
      setFormData({ name: '', role: '', company: '', message: '', rating: 5 });

      setTimeout(() => {
        setIsModalOpen(false);
        setSuccessMsg(null);
      }, 3500);
    }
  };

  return (
    <section className="testimonials-section" ref={sectionRef} id="testimonials-section">
      <div className="testimonials-container">
        {/* Header */}
        <div className="testimonials-header">
          <div className="testimonials-tag">
            <Award size={14} color="var(--accent-primary)" />
            <span>Endorsements &amp; Reviews</span>
          </div>
          <h2 className="testimonials-title">
            Client &amp; Peer <span>Testimonials</span>
          </h2>
          <p className="testimonials-subtitle">
            Feedback and endorsements from managers, co-workers, and engineering leaders I've collaborated with.
          </p>
        </div>

        {/* Top Action Bar */}
        <div className="testimonials-top-bar">
          <span className="testimonials-count">
            {testimonials.length} Endorsement{testimonials.length === 1 ? '' : 's'}
          </span>
          <button type="button" onClick={handleOpenModal} className="add-testimonial-btn">
            <Plus size={16} />
            <span>Leave a Testimonial</span>
          </button>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div className="t-skeleton">Loading testimonials...</div>
        ) : (
          <div className="testimonials-grid">
            {testimonials.map((item) => (
              <div key={item.id} className="testimonial-card">
                <div className="t-card-top">
                  <div className="t-stars" aria-label={`${item.rating || 5} out of 5 stars`}>
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <Star key={i} size={14} fill="#FACC15" stroke="none" />
                    ))}
                  </div>
                  <Quote size={20} className="t-quote-icon" />
                </div>

                <p className="t-message">"{item.message}"</p>

                <div className="t-author">
                  <div className="t-avatar">
                    {item.name.substring(0, 1).toUpperCase()}
                  </div>
                  <div className="t-meta">
                    <span className="t-name">{item.name}</span>
                    <span className="t-role">
                      {item.role || 'Peer'}
                      {item.company ? ` • ${item.company}` : ''}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submission Modal */}
      {isModalOpen && (
        <div className="testimonial-modal-backdrop" onClick={handleCloseModal}>
          <div className="testimonial-modal" onClick={(e) => e.stopPropagation()}>
            <div className="t-modal-header">
              <h3 className="t-modal-title">Leave an Endorsement</h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="t-modal-close"
                disabled={submitting}
              >
                <X size={18} />
              </button>
            </div>

            {successMsg && (
              <div className="t-banner t-banner--success">
                <CheckCircle size={16} style={{ display: 'inline', marginRight: 6 }} />
                {successMsg}
              </div>
            )}

            {errorMsg && (
              <div className="t-banner t-banner--error">
                <AlertCircle size={16} style={{ display: 'inline', marginRight: 6 }} />
                {errorMsg}
              </div>
            )}

            {!successMsg && (
              <form onSubmit={handleSubmit}>
                <div className="t-form-group">
                  <label htmlFor="t-name">Your Name *</label>
                  <input
                    id="t-name"
                    type="text"
                    className="t-input"
                    placeholder="e.g. Alex Morgan"
                    maxLength={100}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="t-form-group">
                  <label htmlFor="t-role">Role / Title &amp; Company</label>
                  <input
                    id="t-role"
                    type="text"
                    className="t-input"
                    placeholder="e.g. Tech Lead @ Acme Corp"
                    maxLength={100}
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  />
                </div>

                <div className="t-form-group">
                  <label>Rating</label>
                  <div className="t-rating-select">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`t-star-btn ${
                          star <= formData.rating ? 't-star-btn--active' : ''
                        }`}
                        onClick={() => setFormData({ ...formData, rating: star })}
                        aria-label={`${star} star`}
                      >
                        <Star
                          size={22}
                          fill={star <= formData.rating ? '#FACC15' : 'transparent'}
                          stroke={star <= formData.rating ? '#FACC15' : 'currentColor'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="t-form-group">
                  <label htmlFor="t-message">Your Testimonial *</label>
                  <textarea
                    id="t-message"
                    className="t-textarea"
                    placeholder="Share your experience working with Navin..."
                    maxLength={1000}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                  <div className="t-char-count">{formData.message.length}/1000</div>
                </div>

                <button type="submit" className="t-submit-btn" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Endorsement'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonials;
