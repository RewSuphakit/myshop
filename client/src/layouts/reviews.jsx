import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';
function Reviews() {
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const { id } = useParams();
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(5); 

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
  }, [reviews.length]);

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
        toast.success('Comment added successfully!',{
          position: "top-center"
        });
        setNewComment('');

        const newReview = response.data.review;
        addCommentToReviews(newReview); 
      } else {
        console.error('Failed to add comment:', response.data);
        toast.error('Failed to add comment. Please try again later.');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Error adding comment. Please try again later.',{
        position: "top-center"
      });
    }
  };


  const handleRatingChange = (value) => {
    setRating(value);
  };


  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };


  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  const goToPage = (pageNumber) => setCurrentPage(pageNumber);






const handleEditReview = (id) => {
  console.log(`Editing review ${id}`);
};




const [editingReviewId, setEditingReviewId] = useState(null);
const [editedComment, setEditedComment] = useState('');


const startEditReview = (id, initialComment) => {
  setEditingReviewId(id);
  setEditedComment(initialComment);
};


const cancelEditReview = () => {
  setEditingReviewId(null);
  setEditedComment('');
};

const submitEditedReview = async () => {
  try {
    let token = localStorage.getItem('token');
    const response = await axios.put(`http://localhost:8000/api/reviews/${editingReviewId}`, {
      comment: editedComment,
      user: {
        first_name: user.first_name,
        last_name: user.last_name,
      }
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status === 200) {
      toast.success('Review updated successfully!',{
        position: "top-center"
      });
      setReviews(reviews.map(review => {
        if (review.review_id === editingReviewId) {
          return { ...review, user: user, comment: editedComment };
        }
        return review;
      }));
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
    <div className="">
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
      <textarea
        rows="4"
        cols="50"
        value={newComment}
        required
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a comment..."
        className="w-full  p-2 border-gray-300 border rounded-md "
      />
      <button className="btn btn-primary mb-2" onClick={handleAddComment}>
        Add Comment
      </button>
      <div>
      {currentReviews.map((review) => (
  <div key={review.review_id} className="bg-gray-100 p-4 rounded-md mb-4 relative ">
    <p className="font-semibold">User: {review.user ? `${review.user.first_name} ${review.user.last_name}` : 'Anonymous'}</p>
    {editingReviewId === review.review_id ? (
      <textarea
        rows="4"
        cols="50"
        value={editedComment}
        onChange={(e) => setEditedComment(e.target.value)}
        placeholder="Edit your comment..."
        className="w-full p-2 border-gray-300 rounded-md mt-4"
      />
    ) : (
      <p className=" overflow-y-auto">Comment: {review.comment}</p>
    )}
    <p>Rating: {review.rating}</p>
    <div className="absolute top-0 right-0 flex gap-2">
      {user && user.user_id === review.user_id && ( 
        editingReviewId === review.review_id ? (
          <>
            <button className="btn btn-success" onClick={submitEditedReview}>Save</button>
            <button className="btn btn-secondary" onClick={cancelEditReview}>Cancel</button>
          </>
        ) : (
          <>
            <button className="btn btn-primary" onClick={() => startEditReview(review.review_id, review.comment)}>Edit</button>
            <button className="btn btn-danger" onClick={() => handleDeleteReview(review.review_id)}>Delete</button>
          </>
        )
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
