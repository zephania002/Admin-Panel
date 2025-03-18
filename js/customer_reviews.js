document.addEventListener('DOMContentLoaded', function() {
    const reviewsGrid = document.getElementById('reviewsGrid');

    function loadPublishedTestimonials() {
        reviewsGrid.innerHTML = '<div class="loading-message">Loading reviews...</div>';

        fetch('/api/testimonials/published') // Replace with your actual API endpoint
            .then(response => response.json())
            .then(data => {
                reviewsGrid.innerHTML = '';
                if (data && data.length > 0) {
                    data.forEach(testimonial => {
                        const reviewCard = document.createElement('div');
                        reviewCard.classList.add('review-card');
                        let ratingStars = '';
                        if (testimonial.rating) {
                            for (let i = 0; i < testimonial.rating; i++) {
                                ratingStars += '<i class="bx bxs-star"></i>';
                            }
                        }

                        reviewCard.innerHTML = `
                            <div class="customer-info">
                                ${testimonial.customer_image_url ? `<img src="${testimonial.customer_image_url}" alt="${testimonial.customer_name}">` : '<div class="placeholder-avatar"><i class="bx bxs-user-circle"></i></div>'}
                                <h4 class="customer-name">${testimonial.customer_name}</h4>
                            </div>
                            <p class="testimonial-text">${testimonial.testimonial_text}</p>
                            ${ratingStars ? `<div class="rating">${ratingStars}</div>` : ''}
                        `;
                        reviewsGrid.appendChild(reviewCard);
                    });
                } else {
                    reviewsGrid.innerHTML = '<p class="no-reviews">No customer reviews available yet.</p>';
                }
            })
            .catch(error => {
                console.error('Error loading testimonials:', error);
                reviewsGrid.innerHTML = '<p class="error-loading">Error loading customer reviews.</p>';
            });
    }

    // Call the function to load testimonials when the page loads
    loadPublishedTestimonials();
});