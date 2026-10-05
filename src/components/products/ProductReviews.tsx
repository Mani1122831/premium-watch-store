import { useState } from 'react';
import { Star, CheckCircle, MessageSquarePlus } from 'lucide-react';
import { reviews as initialReviews, Review } from '../../data/reviews';

interface ProductReviewsProps {
  productId: string;
  rating: number;
  totalReviews: number;
}

export default function ProductReviews({
  productId,
  rating,
  totalReviews,
}: ProductReviewsProps) {
  const [reviewsList, setReviewsList] = useState<Review[]>(
    initialReviews.filter(r => r.productId === productId)
  );

  // Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !reviewComment.trim() || !reviewTitle.trim()) return;

    const newRev: Review = {
      id: 'rev-' + Date.now(),
      productId,
      author: authorName.trim(),
      rating: userRating,
      date: new Date().toISOString().split('T')[0],
      title: reviewTitle.trim(),
      comment: reviewComment.trim(),
      verified: true,
    };

    setReviewsList([newRev, ...reviewsList]);
    setAuthorName('');
    setReviewTitle('');
    setReviewComment('');
    setShowAddForm(false);
    setFormSubmitted(true);
  };

  return (
    <div className="space-y-10">
      {/* Review Summary Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#faf9f7] p-8 border border-charcoal-100">
        <div className="md:col-span-4 text-center md:text-left space-y-2 border-b md:border-b-0 md:border-r border-charcoal-200 pb-6 md:pb-0 md:pr-8">
          <div className="font-serif text-5xl font-light text-charcoal-950">{rating}</div>
          <div className="flex items-center justify-center md:justify-start gap-1 text-gold-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(rating) ? 'fill-gold-500 text-gold-500' : 'text-charcoal-300'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-charcoal-500 font-light">
            Based on {totalReviews + (reviewsList.length - initialReviews.filter(r => r.productId === productId).length)} verified owner reviews
          </p>
        </div>

        <div className="md:col-span-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 w-full max-w-sm text-xs text-charcoal-600">
            <div className="flex items-center gap-3">
              <span className="w-12 text-right">5 stars</span>
              <div className="flex-1 bg-charcoal-200 h-2 rounded-full overflow-hidden">
                <div className="bg-gold-500 h-full w-[88%]" />
              </div>
              <span className="w-8 text-right font-medium text-charcoal-900">88%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-12 text-right">4 stars</span>
              <div className="flex-1 bg-charcoal-200 h-2 rounded-full overflow-hidden">
                <div className="bg-gold-500 h-full w-[10%]" />
              </div>
              <span className="w-8 text-right font-medium text-charcoal-900">10%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-12 text-right">3 stars</span>
              <div className="flex-1 bg-charcoal-200 h-2 rounded-full overflow-hidden">
                <div className="bg-gold-500 h-full w-[2%]" />
              </div>
              <span className="w-8 text-right font-medium text-charcoal-900">2%</span>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-6 py-3 bg-charcoal-950 text-white text-xs font-bold tracking-[0.15em] uppercase hover:bg-gold-500 transition-colors shrink-0 flex items-center gap-2 cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>{showAddForm ? 'Cancel' : 'Write a Review'}</span>
          </button>
        </div>
      </div>

      {formSubmitted && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>Thank you! Your verified owner review has been published.</span>
        </div>
      )}

      {/* Review Submission Form */}
      {showAddForm && (
        <form onSubmit={handleSubmitReview} className="bg-white p-6 border border-charcoal-200 space-y-4 animate-slide-up">
          <h4 className="font-serif text-lg text-charcoal-950 font-medium">Write Your Review</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-charcoal-700 uppercase tracking-wider block mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-950"
                placeholder="e.g. Vikram C."
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal-700 uppercase tracking-wider block mb-1">
                Rating
              </label>
              <div className="flex items-center gap-1 py-1.5">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    className="p-1 cursor-pointer focus:outline-none"
                    aria-label={`${star} Stars`}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= userRating
                          ? 'fill-gold-500 text-gold-500'
                          : 'text-charcoal-300 hover:text-gold-400'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-700 uppercase tracking-wider block mb-1">
              Review Title
            </label>
            <input
              type="text"
              value={reviewTitle}
              onChange={e => setReviewTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-950"
              placeholder="e.g. Extraordinary finishing on the bezel"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-700 uppercase tracking-wider block mb-1">
              Your Comments
            </label>
            <textarea
              rows={4}
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
              required
              className="w-full px-3 py-2 border border-charcoal-300 text-sm focus:outline-none focus:border-charcoal-950"
              placeholder="Describe your experience with the timepiece, comfort, accuracy, and presentation..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-6 py-2.5 border border-charcoal-300 text-xs font-bold uppercase tracking-wider text-charcoal-700 hover:bg-charcoal-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 bg-charcoal-950 text-white text-xs font-bold uppercase tracking-widest hover:bg-gold-500 transition-colors"
            >
              Post Review
            </button>
          </div>
        </form>
      )}

      {/* Review List */}
      <div className="space-y-6 divide-y divide-charcoal-100">
        {reviewsList.length === 0 ? (
          <p className="text-sm text-charcoal-500 font-light py-8 text-center">
            No reviews yet for this model. Be the first to share your experience.
          </p>
        ) : (
          reviewsList.map(review => (
            <div key={review.id} className="pt-6 first:pt-0 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-charcoal-950">{review.author}</span>
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>Verified Owner</span>
                    </span>
                  )}
                </div>
                <span className="text-xs text-charcoal-400">{review.date}</span>
              </div>

              <div className="flex items-center gap-1 text-gold-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < review.rating ? 'fill-gold-500 text-gold-500' : 'text-charcoal-200'
                    }`}
                  />
                ))}
              </div>

              <h5 className="font-medium text-sm text-charcoal-900 pt-1">{review.title}</h5>
              <p className="text-xs sm:text-sm text-charcoal-600 font-light leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
