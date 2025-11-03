/**
 * Helper utility for sending feedback to Recommendation System
 * Handles errors gracefully to not disrupt main application flow
 */

import { recordFeedback as recordFeedbackAPI } from '../services/recommendationService';

/**
 * Send feedback to RS with error handling
 * @param {number} userId - User ID
 * @param {number} bookId - Book ID
 * @param {string} event - Event type: 'view', 'favorite', 'rate'
 * @param {number|null} ratingValue - Rating value (1-5) for 'rate' event
 * @returns {Promise<boolean>} - Returns true if successful, false otherwise
 */
export const sendFeedback = async (userId, bookId, event, ratingValue = null) => {
  // Validate inputs
  if (!userId || !bookId || !event) {
    console.warn('Invalid feedback parameters:', { userId, bookId, event });
    return false;
  }

  // Validate event type
  const validEvents = ['history', 'favorite', 'rating'];
  if (!validEvents.includes(event)) {
    console.warn('Invalid event type:', event);
    return false;
  }

  // Validate rating value for 'rating' event
  if (event === 'rating') {
    if (!ratingValue || ratingValue < 1 || ratingValue > 5) {
      console.warn('Invalid rating value for rating event:', ratingValue);
      return false;
    }
  }

  try {
    const response = await recordFeedbackAPI(userId, bookId, event, ratingValue);
    
    // Log success with details
    const eventLabel = {
      'history': '👁️ View',
      'favorite': '❤️ Favorite',
      'rating': '⭐ Rating'
    }[event];
    
    console.log(`📊 RS Feedback: ${eventLabel} | User: ${userId} | Book: ${bookId}${ratingValue ? ` | Rating: ${ratingValue}` : ''}`);
    
    // Log online learning status if available
    if (response?.online_learning) {
      console.log(`   └─ Online Learning: ${response.online_learning ? '✅ Active' : '⏸️ Inactive'}`);
      if (response.buffer_status) {
        const { buffer_size, buffer_capacity, buffer_full } = response.buffer_status;
        console.log(`   └─ Buffer: ${buffer_size}/${buffer_capacity} ${buffer_full ? '🔴 FULL' : '🟢'}`);
      }
    }
    
    return true;
  } catch (error) {
    // Non-critical error - log but don't throw
    console.warn('Failed to send feedback to RS (non-critical):', error.message);
    return false;
  }
};

/**
 * Batch send multiple feedbacks
 * @param {Array<{userId, bookId, event, ratingValue}>} feedbacks
 * @returns {Promise<{success: number, failed: number}>}
 */
export const sendBatchFeedback = async (feedbacks) => {
  const results = await Promise.allSettled(
    feedbacks.map(({ userId, bookId, event, ratingValue }) =>
      sendFeedback(userId, bookId, event, ratingValue)
    )
  );

  const success = results.filter(r => r.status === 'fulfilled' && r.value === true).length;
  const failed = results.length - success;

  console.log(`📊 Batch Feedback: ${success} succeeded, ${failed} failed`);

  return { success, failed };
};

export default {
  sendFeedback,
  sendBatchFeedback
};