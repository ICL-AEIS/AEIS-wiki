const fs = require('fs');

/**
 * Calculate mean rating from reviews
 * @param {Array} reviews - Array of review objects
 * @returns {number} Mean rating
 */
function calculateMeanRating(reviews) {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / reviews.length;
}

/**
 * Generate star HTML based on rating
 * @param {number} rating - Rating from 0-5
 * @returns {string} HTML for stars
 */
function generateStars(rating) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  // Full stars
  for (let i = 0; i < fullStars; i++) {
    stars.push('      <span class="star filled">★</span>');
  }
  
  // Half star
  if (hasHalfStar) {
    stars.push('      <span class="star half">★</span>');
  }
  
  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    stars.push('      <span class="star empty">★</span>');
  }
  
  return stars.join('\n');
}

/**
 * Generate HTML for a single review
 */
function generateReview(review) {
  return `    <div class="review">
      <div class="review-header">
        <span class="reviewer">${review.reviewer}</span>
        <span class="review-date">${review.date}</span>
        <div class="review-stars">
${generateStars(review.rating)}
        </div>
      </div>
      <p class="review-text">
        ${review.text}
      </p>
    </div>`;
}

/**
 * Generate HTML for a complete course
 */
function generateCourse(course) {
  const reviews = course.reviews.map(r => generateReview(r)).join('\n    \n');
  const meanRating = calculateMeanRating(course.reviews);
  const reviewCount = course.reviews.length;
  
  // Generate course link if URL is provided
  const courseLink = course.url 
    ? `<a href="${course.url}" class="course-link" target="_blank" rel="noopener">Course Website →</a>`
    : '';
  
  return `<div class="course-review">
  <h2 class="course-title">${course.title}</h2>
  <div class="course-meta">
    <span class="provider">Provider: ${course.provider}</span>
    ${courseLink}
  </div>
  
  <div class="rating">
    <div class="stars">
${generateStars(meanRating)}
    </div>
    <span class="rating-number">${meanRating.toFixed(1)}/5.0</span>
    <span class="review-count">(${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'})</span>
  </div>
  
  <div class="reviews">
${reviews}
  </div>
</div>`;
}

/**
 * Generate the complete courses.qmd file
 */
function generateCoursesPage() {
  const dataPath = './courses-data.json';
  const outputPath = './courses.qmd';
  
  // Check if data file exists
  if (!fs.existsSync(dataPath)) {
    throw new Error(`${dataPath} not found`);
  }
  
  // Read course data
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  
  // Generate HTML for all courses
  const coursesHTML = data.courses.map(c => generateCourse(c)).join('\n\n');
  
  // Calculate total reviews
  const totalReviews = data.courses.reduce((sum, c) => sum + c.reviews.length, 0);
  
  // Create the complete QMD file
  const qmdContent = `---
title: "Courses"
format:
  html:
    css: courses.css
---

Imperial offers a range of courses for staff and students including the [Thriving at Imperial](https://www.imperial.ac.uk/human-resources/talent/courses-and-programmes/thriving-at-imperial/courses/) courses and the [Early Career Researcher Institute (ECRI)](https://www.imperial.ac.uk/early-career-researcher-institute/learning-and-development/) courses.

PhD students are required to gain at least 4 ECRI credits before their Late Stage Review (LSR) including 2 by their Early Stage Assessment (ESA).

The following are courses taken by members of the group with reviews.

\`\`\`{=html}
${coursesHTML}
\`\`\`
`;
  
  // Write the QMD file
  fs.writeFileSync(outputPath, qmdContent, 'utf8');
  
  console.log('Generated courses.qmd');
  console.log(`Processed ${data.courses.length} courses`);
  console.log(`Total reviews: ${totalReviews}`);
  
  // Show calculated ratings
  data.courses.forEach(course => {
    const meanRating = calculateMeanRating(course.reviews);
    console.log(`  - ${course.title}: ${meanRating.toFixed(1)}/5.0 (${course.reviews.length} reviews)`);
  });
}

// Run the generator
try {
  generateCoursesPage();
  console.log('\nCourse page generation complete!');
} catch (error) {
  console.error('Error generating courses page:', error.message);
  process.exit(1);
}
