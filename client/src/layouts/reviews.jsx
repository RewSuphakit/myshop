import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function Reviews() {
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const { id } = useParams();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5); // จำนวนรีวิวต่อหน้า

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        let token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:8000/api/reviews/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(res.data.reviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [id]);

  const addCommentToReviews = (newReview) => {
    setReviews([...reviews, newReview]);
  };

  const handleAddComment = async () => {
    try {
      const commentData = {
        productId: id,
        userId: user.user_id,
        comment: newComment,
        rating: rating,
      };

      let token = localStorage.getItem('token');
      const response = await axios.post(`http://localhost:8000/api/reviews/${id}`, commentData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        alert('Comment added successfully!');
        setNewComment('');

        const newReview = response.data.review;
        addCommentToReviews(newReview); // Add the new comment to the reviews array
      } else {
        console.error('Failed to add comment:', response.data);
        alert('Failed to add comment. Please try again later.');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Error adding comment. Please try again later.');
    }
  };

  // Function to handle rating change
  const handleRatingChange = (value) => {
    setRating(value);
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  // Get current reviews
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  // Change page
  const goToPage = (pageNumber) => setCurrentPage(pageNumber);





// Function to handle editing a review
const handleEditReview = (id) => {
  // Implement your edit logic here, such as opening a modal or redirecting to an edit page
  console.log(`Editing review ${id}`);
};

// Function to handle deleting a review
const handleDeleteReview = async (id) => {
  try {
    let token = localStorage.getItem('token');
    const response = await axios.delete(`http://localhost:8000/api/reviews/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 204) {
      alert('Review deleted successfully!');
      // Remove the deleted review from the state
      setReviews(reviews.filter(review => review.review_id !== id));
    } else {
      console.error('Failed to delete review:', response.data);
      alert('Failed to delete review. Please try again later.');
    }
  } catch (error) {
    console.error('Error deleting review:', error);
    alert('Error deleting review. Please try again later.');
  }
};


const [editingReviewId, setEditingReviewId] = useState(null);
const [editedComment, setEditedComment] = useState('');

// Function to handle starting the edit process
const startEditReview = (id, initialComment) => {
  setEditingReviewId(id);
  setEditedComment(initialComment);
};

// Function to handle canceling the edit process
const cancelEditReview = () => {
  setEditingReviewId(null);
  setEditedComment('');
};

// Function to handle submitting the edited review
const submitEditedReview = async () => {
  try {
    let token = localStorage.getItem('token');
    const response = await axios.put(`http://localhost:8000/api/reviews/${editingReviewId}`, {
      comment: editedComment,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200) {
      alert('Review updated successfully!');
      // Update the review in the state
      setReviews(reviews.map(review => {
        if (review.review_id === editingReviewId) {
          return { ...review, comment: editedComment };
        }
        return review;
      }));
      // Clear the editing state
      cancelEditReview();
    } else {
      console.error('Failed to update review:', response.data);
      alert('Failed to update review. Please try again later.');
    }
  } catch (error) {
    console.error('Error updating review:', error);
    alert('Error updating review. Please try again later.');
  }
};



  
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>
      <p>Average Rating: {calculateAverageRating()} / 5.0</p>
      <div className="rating rating-lg rating-half mb-4">
        {[1, 2, 3, 4, 5].map((index) => (
          <input
            className={`bg-yellow-500 mask mask-star-2 ${
              index <= rating ? '' : 'mask-star'
            }`}
            key={index}
            type="radio"
            name="rating"
            value={index}
            checked={rating === index}
            onChange={() => handleRatingChange(index)}
            style={{ marginRight: '5px' }}
          />
        ))}
      </div>
      {/* Comment input field */}
      <textarea
        rows="4"
        cols="50"
        value={newComment}
        required
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment..."
        className="w-full h-10 border-gray-300 rounded-md mt-4"
      />
      <button className="btn btn-primary mt-2" onClick={handleAddComment}>
        Add Comment
      </button>

      {/* Display current page of comments */}
      <div>
      {currentReviews.map((review) => (
  <div key={review.review_id} className="bg-gray-100 p-4 rounded-md mb-4 relative">
    <p className="font-semibold">User: {review.user ? `${review.user.first_name} ${review.user.last_name}` : 'Anonymous'}</p>
    {editingReviewId === review.review_id ? (
      <textarea
        rows="4"
        cols="50"
        value={editedComment}
        onChange={(e) => setEditedComment(e.target.value)}
        placeholder="Edit your comment..."
        className="w-full h-10 border-gray-300 rounded-md mt-2"
      />
    ) : (
      <p>Comment: {review.comment}</p>
    )}
    <p>Rating: {review.rating}</p>
    <div className="absolute top-0 right-0 flex gap-2">
      {editingReviewId === review.review_id ? (
        <>
          <button className="btn btn-success" onClick={submitEditedReview}>Save</button>
          <button className="btn btn-secondary" onClick={cancelEditReview}>Cancel</button>
        </>
      ) : (
        <>
          <button className="btn btn-primary" onClick={() => startEditReview(review.review_id, review.comment)}>Edit</button>
          <button className="btn btn-danger" onClick={() => handleDeleteReview(review.review_id)}>Delete</button>
        </>
      )}
    </div>
  </div>
))}
      </div>

      {/* Pagination */}
      <nav className="mt-4 flex justify-center">
  <ul className="pagination flex">
    {Array.from({ length: Math.ceil(reviews.length / reviewsPerPage) }, (_, i) => (
      <li key={i} className="pagination-item">
        <button onClick={() => goToPage(i + 1)} className="btn btn-default">
          {i + 1}
        </button>
      </li>
    ))}
  </ul>
</nav>
    </div>
  );
}

export default Reviews;
