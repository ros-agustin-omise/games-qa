// Test Case Designer Game Logic

// Game state
let currentGame = {
    difficulty: '',
    currentFeatureIndex: 0,
    features: [],
    selectedTestCases: [],
    customTestCases: [],
    score: 0,
    totalScore: 0,
    hintsUsed: 0,
    startTime: null
};

// Swipe state
let swipeState = {
    currentCategory: 0,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isDragging: false,
    hasSwipeHintShown: false
};

// Test scenarios database
const testScenarios = {
    beginner: [
        {
            title: "User Login Form",
            description: "A simple login form with username and password fields.",
            requirements: [
                "Username field accepts alphanumeric characters",
                "Password field masks input",
                "Login button submits the form",
                "Remember me checkbox is optional",
                "Username max length: 50 characters",
                "Password min length: 8 characters"
            ],
            testCases: {
                positive: [
                    { id: 'p1', text: 'Valid username and password combination', points: 10, essential: true },
                    { id: 'p2', text: 'Login with remember me checked', points: 5 },
                    { id: 'p3', text: 'Login with special characters in password', points: 8 },
                    { id: 'p4', text: 'Login with minimum length password (8 chars)', points: 8 }
                ],
                negative: [
                    { id: 'n1', text: 'Empty username field', points: 10, essential: true },
                    { id: 'n2', text: 'Empty password field', points: 10, essential: true },
                    { id: 'n3', text: 'Invalid username format', points: 8 },
                    { id: 'n4', text: 'Wrong password for valid username', points: 12, essential: true }
                ],
                boundary: [
                    { id: 'b1', text: 'Username with exactly 50 characters', points: 12 },
                    { id: 'b2', text: 'Username with 51 characters', points: 15, essential: true },
                    { id: 'b3', text: 'Password with exactly 8 characters', points: 10 },
                    { id: 'b4', text: 'Password with 7 characters', points: 15, essential: true }
                ],
                security: [
                    { id: 's1', text: 'SQL injection in username field', points: 20, essential: true },
                    { id: 's2', text: 'Password field does not show plain text', points: 15, essential: true },
                    { id: 's3', text: 'Account lockout after multiple failed attempts', points: 18 },
                    { id: 's4', text: 'Session timeout after inactivity', points: 12 }
                ]
            }
        },
        {
            title: "Contact Form Submission",
            description: "A contact form with name, email, subject, and message fields.",
            requirements: [
                "Name field is required",
                "Email field validates email format",
                "Subject field is optional",
                "Message field is required with max 500 characters",
                "Submit button sends the form",
                "Success message appears after submission"
            ],
            testCases: {
                positive: [
                    { id: 'p1', text: 'Submit form with all required fields filled', points: 12, essential: true },
                    { id: 'p2', text: 'Submit form with valid email format', points: 10, essential: true },
                    { id: 'p3', text: 'Submit form without optional subject field', points: 8 },
                    { id: 'p4', text: 'Submit form with special characters in message', points: 6 }
                ],
                negative: [
                    { id: 'n1', text: 'Submit form without name', points: 12, essential: true },
                    { id: 'n2', text: 'Submit form without email', points: 12, essential: true },
                    { id: 'n3', text: 'Submit form without message', points: 12, essential: true },
                    { id: 'n4', text: 'Submit form with invalid email format', points: 15, essential: true }
                ],
                boundary: [
                    { id: 'b1', text: 'Message with exactly 500 characters', points: 10 },
                    { id: 'b2', text: 'Message with 501 characters', points: 15, essential: true },
                    { id: 'b3', text: 'Name field with very long input', points: 12 },
                    { id: 'b4', text: 'Empty spaces only in required fields', points: 14 }
                ],
                security: [
                    { id: 's1', text: 'HTML/Script injection in message field', points: 18, essential: true },
                    { id: 's2', text: 'Email header injection attempt', points: 20 },
                    { id: 's3', text: 'CSRF protection verification', points: 16 },
                    { id: 's4', text: 'Rate limiting for form submissions', points: 14 }
                ]
            }
        }
    ],
    intermediate: [
        {
            title: "E-commerce Shopping Cart",
            description: "Shopping cart functionality with add, remove, and update quantity features.",
            requirements: [
                "Users can add products to cart",
                "Users can update product quantities",
                "Users can remove products from cart",
                "Cart total updates automatically",
                "Cart persists during session",
                "Maximum 10 items per product type"
            ],
            testCases: {
                positive: [
                    { id: 'p1', text: 'Add single product to empty cart', points: 10, essential: true },
                    { id: 'p2', text: 'Add multiple different products', points: 12 },
                    { id: 'p3', text: 'Update product quantity to valid number', points: 15, essential: true },
                    { id: 'p4', text: 'Remove product from cart', points: 12, essential: true },
                    { id: 'p5', text: 'Cart total calculation with discounts', points: 18 }
                ],
                negative: [
                    { id: 'n1', text: 'Add out-of-stock product to cart', points: 15, essential: true },
                    { id: 'n2', text: 'Update quantity to zero', points: 12 },
                    { id: 'n3', text: 'Add product with no price', points: 14 },
                    { id: 'n4', text: 'Remove non-existent product', points: 10 }
                ],
                boundary: [
                    { id: 'b1', text: 'Add exactly 10 items of same product', points: 15 },
                    { id: 'b2', text: 'Try to add 11th item of same product', points: 20, essential: true },
                    { id: 'b3', text: 'Update quantity to maximum allowed (10)', points: 12 },
                    { id: 'b4', text: 'Update quantity to negative number', points: 18, essential: true },
                    { id: 'b5', text: 'Cart with maximum number of different products', points: 16 }
                ],
                security: [
                    { id: 's1', text: 'Manipulate product price in cart', points: 25, essential: true },
                    { id: 's2', text: 'Access another user\'s cart', points: 22, essential: true },
                    { id: 's3', text: 'Bypass maximum quantity limit', points: 20 },
                    { id: 's4', text: 'Cart data encryption verification', points: 18 }
                ]
            }
        }
    ],
    advanced: [
        {
            title: "Payment Processing System",
            description: "Critical payment gateway integration with multiple payment methods.",
            requirements: [
                "Accept credit card, debit card, and PayPal",
                "Validate card numbers using Luhn algorithm",
                "Encrypt sensitive payment data",
                "Handle payment failures gracefully",
                "Process refunds and partial refunds",
                "Comply with PCI DSS standards"
            ],
            testCases: {
                positive: [
                    { id: 'p1', text: 'Successful payment with valid credit card', points: 15, essential: true },
                    { id: 'p2', text: 'Successful PayPal payment', points: 12, essential: true },
                    { id: 'p3', text: 'Process partial refund successfully', points: 20 },
                    { id: 'p4', text: 'Handle multiple currency payments', points: 18 },
                    { id: 'p5', text: 'Process recurring subscription payments', points: 22 }
                ],
                negative: [
                    { id: 'n1', text: 'Payment with expired credit card', points: 18, essential: true },
                    { id: 'n2', text: 'Payment with insufficient funds', points: 20, essential: true },
                    { id: 'n3', text: 'Payment with invalid card number', points: 16, essential: true },
                    { id: 'n4', text: 'Network timeout during payment processing', points: 25 },
                    { id: 'n5', text: 'Payment gateway service unavailable', points: 22 }
                ],
                boundary: [
                    { id: 'b1', text: 'Payment amount at minimum threshold', points: 15 },
                    { id: 'b2', text: 'Payment amount at maximum limit', points: 18 },
                    { id: 'b3', text: 'Payment with amount having many decimal places', points: 20 },
                    { id: 'b4', text: 'Refund amount exceeding original payment', points: 25, essential: true }
                ],
                security: [
                    { id: 's1', text: 'Card data encryption at rest and in transit', points: 30, essential: true },
                    { id: 's2', text: 'PCI DSS compliance verification', points: 35, essential: true },
                    { id: 's3', text: 'Prevention of payment data logging', points: 28 },
                    { id: 's4', text: 'Double-spending prevention', points: 32, essential: true },
                    { id: 's5', text: 'Payment injection attack prevention', points: 30 }
                ]
            }
        }
    ]
};

// Hint system
const hints = {
    general: [
        "Don't forget to test edge cases and boundary conditions!",
        "Consider what happens when users provide unexpected input.",
        "Security testing is crucial - think about potential vulnerabilities.",
        "Always test both positive and negative scenarios.",
        "Think about what could go wrong in real-world usage."
    ],
    positive: [
        "Test the happy path - when everything works as expected.",
        "Verify that valid inputs produce expected results.",
        "Check if all required functionality works correctly."
    ],
    negative: [
        "What happens with invalid or missing input?",
        "Test error handling and validation messages.",
        "Try to break the system with unexpected inputs."
    ],
    boundary: [
        "Test values at the limits of what's acceptable.",
        "Check minimum and maximum values, plus one beyond each.",
        "Look for off-by-one errors in your boundaries."
    ],
    security: [
        "Think like an attacker - how could this be exploited?",
        "Consider injection attacks, authentication bypasses.",
        "Check for data encryption and access control issues."
    ]
};

// Helper function to check if an element or its parents are input-related
function isInputElement(element) {
    // Check the element itself
    if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT' || element.tagName === 'BUTTON') {
        return true;
    }
    
    // Check if element is inside a custom-test-section
    let parent = element.parentElement;
    while (parent) {
        if (parent.classList && parent.classList.contains('custom-test-section')) {
            return true;
        }
        parent = parent.parentElement;
    }
    
    return false;
}

// Swipe and Category Navigation Functions
function initializeSwipeHandlers() {
    const container = document.getElementById('testCategoriesContainer');
    if (!container) return;

    // Touch events for mobile
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Mouse events for desktop
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseUp);

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyNavigation);
    
    // Initialize real-time analysis for all textareas
    initializeRealTimeAnalysis();
}

// Real-time Analysis Functions
function initializeRealTimeAnalysis() {
    const textareas = document.querySelectorAll('.custom-test-input');
    textareas.forEach(textarea => {
        // Create analysis feedback container
        const feedbackContainer = document.createElement('div');
        feedbackContainer.className = 'real-time-feedback';
        feedbackContainer.id = `feedback-${textarea.id}`;
        textarea.parentNode.insertBefore(feedbackContainer, textarea.nextSibling);
        
        // Add event listeners for real-time analysis
        let analysisTimeout;
        textarea.addEventListener('input', function() {
            clearTimeout(analysisTimeout);
            analysisTimeout = setTimeout(() => {
                performRealTimeAnalysis(textarea, feedbackContainer);
            }, 500); // Debounce by 500ms
        });
        
        // Initial analysis
        if (textarea.value.trim()) {
            performRealTimeAnalysis(textarea, feedbackContainer);
        }
    });
}

function performRealTimeAnalysis(textarea, feedbackContainer) {
    const text = textarea.value.trim();
    if (!text) {
        feedbackContainer.innerHTML = '';
        return;
    }
    
    // Get category from textarea ID
    const category = textarea.id.replace('custom', '').toLowerCase();
    
    // First check for trash data
    const trashCheck = TextAnalyzer.detectTrashData(text);
    
    // If content is trash, show warning and stop analysis
    if (trashCheck.isTrash) {
        feedbackContainer.innerHTML = `
            <div class="analysis-preview trash-warning">
                <div class="score-preview" style="color: #dc3545;">
                    ❌ Content will be rejected (0 pts)
                </div>
                <div class="trash-issues">
                    🚫 Issues: ${trashCheck.issues.slice(0, 3).join(' • ')}
                </div>
                <div class="suggestions-preview">
                    💡 Write a detailed test case with specific steps, expected results, and test data
                </div>
            </div>
        `;
        
        // Add visual warning to textarea
        textarea.classList.add('trash-warning-border');
        setTimeout(() => {
            textarea.classList.remove('trash-warning-border');
        }, 2000);
        
        return;
    }
    
    // Remove any previous trash warning styling
    textarea.classList.remove('trash-warning-border');
    
    // Perform full analysis for good content
    const structure = TextAnalyzer.analyzeStructure(text);
    const format = TextAnalyzer.detectFormat(text);
    const completeness = TextAnalyzer.assessCompleteness(text, category);
    const readability = TextAnalyzer.assessReadability(text);
    const suggestions = TextAnalyzer.generateSuggestions(text, category, { format, completeness });
    
    // Calculate estimated score with quality adjustments
    let estimatedScore = 5;
    
    // Apply quality penalty if questionable content
    if (trashCheck.quality === 'questionable') {
        estimatedScore = Math.max(3, estimatedScore - 2);
    }
    
    if (text.length >= 50) estimatedScore += 2;
    if (text.length >= 100) estimatedScore += 3;
    if (format.formatScore > 0) estimatedScore += Math.min(5, Math.ceil(format.formatScore / 3));
    if (completeness.completenessScore > 0) estimatedScore += Math.min(6, Math.ceil(completeness.completenessScore / 2));
    if (structure.hasNumberedSteps || structure.hasBulletPoints) estimatedScore += 2;
    estimatedScore = Math.min(25, estimatedScore);
    
    // Generate feedback HTML
    let feedbackHTML = `<div class="analysis-preview">`;
    
    // Score preview with quality warnings
    const scoreColor = estimatedScore >= 20 ? '#4CAF50' : estimatedScore >= 15 ? '#FF9800' : '#f44336';
    feedbackHTML += `<div class="score-preview" style="color: ${scoreColor}">
        📊 Estimated Score: ${estimatedScore}/25 pts
    </div>`;
    
    // Quality warnings for questionable content
    if (trashCheck.quality === 'questionable') {
        feedbackHTML += `<div class="quality-warning">
            ⚠️ Quality concerns detected - content may receive reduced points
        </div>`;
        
        if (trashCheck.issues.length > 0) {
            feedbackHTML += `<div class="minor-issues">
                Issues: ${trashCheck.issues.slice(0, 3).join(' • ')}
            </div>`;
        }
    }
    
    // Format detection
    if (format.detectedFormats.length > 0) {
        feedbackHTML += `<div class="format-preview">✅ ${format.detectedFormats.join(', ')}</div>`;
    }
    
    // Completeness indicators
    if (completeness.presentComponents.length > 0) {
        feedbackHTML += `<div class="completeness-preview">
            📋 Includes: ${completeness.presentComponents.slice(0, 3).join(', ')}
        </div>`;
    }
    
    // Top suggestions (max 2)
    if (suggestions.length > 0) {
        const topSuggestions = suggestions
            .filter(s => s.priority === 'high')
            .slice(0, 2);
        if (topSuggestions.length > 0) {
            feedbackHTML += `<div class="suggestions-preview">
                💡 ${topSuggestions.map(s => s.suggestion).join(' • ')}
            </div>`;
        }
    }
    
    // Readability score
    if (readability.score < 7) {
        feedbackHTML += `<div class="readability-warning">
            ⚠️ Consider simpler language (Readability: ${readability.score}/10)
        </div>`;
    }
    
    feedbackHTML += `</div>`;
    
    feedbackContainer.innerHTML = feedbackHTML;
    
    // Apply quality-based CSS classes to the analysis preview
    const analysisPreview = feedbackContainer.querySelector('.analysis-preview');
    if (analysisPreview) {
        // Remove existing quality classes
        analysisPreview.classList.remove('good-quality', 'questionable-quality', 'poor-quality');
        
        // Apply appropriate quality class
        if (trashCheck.quality === 'good') {
            analysisPreview.classList.add('good-quality');
        } else if (trashCheck.quality === 'questionable') {
            analysisPreview.classList.add('questionable-quality');
        } else if (trashCheck.quality === 'poor') {
            analysisPreview.classList.add('poor-quality');
        }
    }
}

function handleTouchStart(e) {
    // Don't handle swipe if touching input elements or elements inside custom test sections
    if (isInputElement(e.target)) {
        return;
    }
    
    swipeState.startX = e.touches[0].clientX;
    swipeState.startY = e.touches[0].clientY;
    swipeState.isDragging = true;
}

function handleTouchMove(e) {
    if (!swipeState.isDragging) return;
    
    // Don't interfere with input element interactions
    if (isInputElement(e.target)) {
        return;
    }
    
    swipeState.currentX = e.touches[0].clientX;
    swipeState.currentY = e.touches[0].clientY;
    
    const deltaX = swipeState.startX - swipeState.currentX;
    const deltaY = Math.abs(swipeState.startY - swipeState.currentY);
    
    if (Math.abs(deltaX) > deltaY) {
        e.preventDefault(); // Prevent scrolling
    }
}

function handleTouchEnd(e) {
    if (!swipeState.isDragging) return;
    
    const deltaX = swipeState.startX - swipeState.currentX;
    const deltaY = Math.abs(swipeState.startY - swipeState.currentY);
    
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) {
        if (deltaX > 0) {
            // Swipe left - next category
            navigateCategory(1);
        } else {
            // Swipe right - previous category
            navigateCategory(-1);
        }
    }
    
    swipeState.isDragging = false;
    hideSwipeHint();
}

function handleMouseDown(e) {
    // Don't handle swipe if clicking on input elements
    if (isInputElement(e.target)) {
        return;
    }
    
    swipeState.startX = e.clientX;
    swipeState.startY = e.clientY;
    swipeState.isDragging = true;
    e.preventDefault();
}

function handleMouseMove(e) {
    if (!swipeState.isDragging) return;
    
    swipeState.currentX = e.clientX;
    swipeState.currentY = e.clientY;
}

function handleMouseUp(e) {
    if (!swipeState.isDragging) return;
    
    const deltaX = swipeState.startX - swipeState.currentX;
    const deltaY = Math.abs(swipeState.startY - swipeState.currentY);
    
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > deltaY) {
        if (deltaX > 0) {
            navigateCategory(1);
        } else {
            navigateCategory(-1);
        }
    }
    
    swipeState.isDragging = false;
    hideSwipeHint();
}

function handleKeyNavigation(e) {
    if (document.getElementById('gamePlay').classList.contains('hidden')) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            e.preventDefault();
            navigateCategory(-1);
            break;
        case 'ArrowRight':
            e.preventDefault();
            navigateCategory(1);
            break;
        case '1':
            showCategory(0);
            break;
        case '2':
            showCategory(1);
            break;
        case '3':
            showCategory(2);
            break;
        case '4':
            showCategory(3);
            break;
    }
}

function navigateCategory(direction) {
    const newCategory = swipeState.currentCategory + direction;
    if (newCategory >= 0 && newCategory < 4) {
        showCategory(newCategory);
    }
}

function showCategory(categoryIndex) {
    if (categoryIndex < 0 || categoryIndex > 3) return;
    
    swipeState.currentCategory = categoryIndex;
    const container = document.getElementById('testCategoriesContainer');
    const translateX = -categoryIndex * 25; // 25% per category since container is 400% wide
    
    // Smooth transition to the selected category
    container.style.transform = `translateX(${translateX}%)`;
    
    // Update navigation buttons
    document.querySelectorAll('.category-nav-btn').forEach((btn, index) => {
        btn.classList.toggle('active', index === categoryIndex);
    });
    
    // Update indicators
    document.querySelectorAll('.category-indicator').forEach((indicator, index) => {
        indicator.classList.toggle('active', index === categoryIndex);
    });
    
    // Update category sections
    document.querySelectorAll('.category-section').forEach((section, index) => {
        section.classList.toggle('active', index === categoryIndex);
    });
    
    hideSwipeHint();
}

function hideSwipeHint() {
    if (!swipeState.hasSwipeHintShown) {
        setTimeout(() => {
            const hint = document.getElementById('swipeHint');
            if (hint) {
                hint.classList.add('hidden');
                swipeState.hasSwipeHintShown = true;
            }
        }, 3000);
    }
}

// Initialize game
function startGame(difficulty) {
    currentGame.difficulty = difficulty;
    currentGame.features = [...testScenarios[difficulty]];
    currentGame.currentFeatureIndex = 0;
    currentGame.selectedTestCases = [];
    currentGame.score = 0;
    currentGame.totalScore = 0;
    currentGame.hintsUsed = 0;
    currentGame.startTime = Date.now();
    
    document.getElementById('gameSelection').classList.add('hidden');
    document.getElementById('gamePlay').classList.remove('hidden');
    
    // Initialize swipe handlers
    initializeSwipeHandlers();
    
    loadCurrentFeature();
}

function loadCurrentFeature() {
    const feature = currentGame.features[currentGame.currentFeatureIndex];
    const featureIndex = currentGame.currentFeatureIndex + 1;
    const totalFeatures = currentGame.features.length;
    
    // Update UI
    document.getElementById('featureTitle').textContent = feature.title;
    document.getElementById('featureValue').textContent = `${featureIndex}/${totalFeatures}`;
    document.getElementById('scoreValue').textContent = currentGame.totalScore;
    
    // Load feature description
    const featureDetails = document.getElementById('featureDetails');
    featureDetails.innerHTML = `
        <p><strong>Description:</strong> ${feature.description}</p>
        <p><strong>Requirements:</strong></p>
        <ul>
            ${feature.requirements.map(req => `<li>${req}</li>`).join('')}
        </ul>
    `;
    
    // Load test case options
    loadTestCaseOptions(feature.testCases);
    
    // Reset selections and swipe state
    currentGame.selectedTestCases = [];
    currentGame.customTestCases = [];
    swipeState.currentCategory = 0;
    swipeState.hasSwipeHintShown = false;
    
    // Clear custom test case UI
    ['Positive', 'Negative', 'Boundary', 'Security'].forEach(category => {
        const listContainer = document.getElementById(`custom${category}List`);
        if (listContainer) {
            listContainer.innerHTML = '';
        }
        const textarea = document.getElementById(`custom${category.toLowerCase()}`);
        if (textarea) {
            textarea.value = '';
        }
    });
    
    // Reset to first category
    showCategory(0);
    
    // Show swipe hint
    const hint = document.getElementById('swipeHint');
    if (hint) {
        hint.classList.remove('hidden');
    }
    
    // Reset coverage display
    document.getElementById('coverageQuality').textContent = 'Starting...';
    document.getElementById('coverageQuality').className = 'coverage-quality-label';
    
    updateCoverage();
}

function loadTestCaseOptions(testCases) {
    const categories = ['positive', 'negative', 'boundary', 'security'];
    const categoryIds = ['positiveTests', 'negativeTests', 'boundaryTests', 'securityTests'];
    
    categories.forEach((category, index) => {
        const container = document.getElementById(categoryIds[index]);
        if (!container) {
            console.error(`Container not found for category: ${category}, ID: ${categoryIds[index]}`);
            return;
        }
        
        container.innerHTML = '';
        
        if (!testCases[category] || !Array.isArray(testCases[category])) {
            console.error(`Test cases not found or invalid for category: ${category}`, testCases[category]);
            return;
        }
        
        console.log(`Loading ${testCases[category].length} test cases for category: ${category}`);
        
        testCases[category].forEach(testCase => {
            const option = document.createElement('div');
            option.className = 'test-option';
            option.innerHTML = `
                <input type="checkbox" id="${testCase.id}" onchange="toggleTestCase('${testCase.id}', '${category}')">
                <label for="${testCase.id}">${testCase.text}</label>
            `;
            container.appendChild(option);
        });
    });
}

function toggleTestCase(testId, category) {
    const checkbox = document.getElementById(testId);
    const option = checkbox.closest('.test-option');
    
    if (checkbox.checked) {
        currentGame.selectedTestCases.push({ id: testId, category: category });
        option.classList.add('selected');
    } else {
        currentGame.selectedTestCases = currentGame.selectedTestCases.filter(tc => tc.id !== testId);
        option.classList.remove('selected');
    }
    
    updateCoverage();
}

// Custom Test Case Functions
function addCustomTestCase(category, inputId) {
    const textarea = document.getElementById(inputId);
    const testCaseText = textarea.value.trim();
    
    if (!testCaseText || testCaseText.length < 10) {
        alert('Please enter a test case with at least 10 characters.');
        return;
    }
    
    // Quick pre-check for obviously too short content
    if (testCaseText.length < 25) {
        alert('⚠️ Test case too short!\n\nPlease provide a detailed test case with:\n• Specific test steps\n• Clear expected results\n• Relevant test data\n\nMinimum 25 characters required for meaningful content.');
        return;
    }
    
    // Score the custom test case
    const score = scoreCustomTestCase(testCaseText, category);
    
    // Reject trash content
    if (score.analysis.isRejected) {
        const issues = score.analysis.trashCheck.issues;
        alert(`❌ Test Case Rejected!\n\nIssues detected:\n• ${issues.slice(0, 4).join('\n• ')}\n\n✅ Please write a proper test case with:\n• Specific test steps (click, enter, select, etc.)\n• Clear expected results (should display, will show, etc.)\n• Relevant test data (usernames, passwords, values)\n• Professional testing language\n\nExample: "User enters invalid email format 'test@invalid' in login field, clicks submit button, system should display error message 'Please enter a valid email address'"`);
        
        // Highlight the textarea with error styling
        textarea.classList.add('rejected-content');
        setTimeout(() => {
            textarea.classList.remove('rejected-content');
        }, 3000);
        
        return;
    }
    
    // Generate unique ID for custom test case
    const customId = `custom_${category}_${Date.now()}`;
    
    // Create custom test case object with enhanced analysis
    const customTestCase = {
        id: customId,
        text: testCaseText,
        category: category,
        points: score.points,
        breakdown: score.breakdown,
        analysis: score.analysis, // Store full analysis results
        isCustom: true
    };
    
    // Add to game state
    currentGame.customTestCases.push(customTestCase);
    currentGame.selectedTestCases.push({ id: customId, category: category });
    
    // Display the custom test case
    displayCustomTestCase(customTestCase, category);
    
    // Clear the textarea
    textarea.value = '';
    
    // Update coverage
    updateCoverage();
    
    // Add points to current score immediately
    currentGame.totalScore += score.points;
    document.getElementById('scoreValue').textContent = currentGame.totalScore;
}

// Advanced Text Analysis Engine
const TextAnalyzer = {
    // Detect and filter trash/low-quality data
    detectTrashData(text) {
        const cleanText = text.toLowerCase().trim();
        let trashScore = 0;
        let issues = [];
        
        // 1. Check for excessive repetition
        const words = cleanText.split(/\s+/);
        const uniqueWords = new Set(words);
        const repetitionRatio = words.length > 0 ? uniqueWords.size / words.length : 0;
        
        if (repetitionRatio < 0.3 && words.length > 5) {
            trashScore += 8;
            issues.push('Excessive word repetition');
        }
        
        // 2. Check for random character sequences
        const randomPatterns = [
            /(.)\1{4,}/g,           // Same character repeated 5+ times
            /[a-z]{1}[a-z]{1}[a-z]{1}/g, // Short random sequences
            /^\w{1,3}(\s\w{1,3}){5,}/,   // Multiple very short words
            /[0-9]{10,}/,           // Long number sequences
            /[^a-zA-Z0-9\s.,!?()-]{5,}/ // Special character spam
        ];
        
        randomPatterns.forEach(pattern => {
            if (pattern.test(cleanText)) {
                trashScore += 3;
                issues.push('Random character patterns detected');
            }
        });
        
        // 3. Check minimum meaningful content
        const meaningfulWords = [
            'test', 'user', 'system', 'login', 'password', 'email', 'form', 'button',
            'click', 'enter', 'submit', 'verify', 'check', 'validate', 'confirm',
            'result', 'expect', 'should', 'will', 'display', 'show', 'message',
            'error', 'success', 'fail', 'input', 'output', 'data', 'field',
            'page', 'website', 'application', 'function', 'feature', 'access',
            'account', 'profile', 'dashboard', 'menu', 'navigation', 'link'
        ];
        
        const hasMeaningfulContent = meaningfulWords.some(word => 
            cleanText.includes(word)
        );
        
        if (!hasMeaningfulContent && cleanText.length > 20) {
            trashScore += 6;
            issues.push('No testing-related content detected');
        }
        
        // 4. Check for gibberish (consonant/vowel patterns)
        const vowels = 'aeiou';
        const consonants = 'bcdfghjklmnpqrstvwxyz';
        let consonantStreak = 0;
        let vowelStreak = 0;
        let maxConsonantStreak = 0;
        let maxVowelStreak = 0;
        
        for (let char of cleanText.replace(/[^a-z]/g, '')) {
            if (vowels.includes(char)) {
                vowelStreak++;
                consonantStreak = 0;
                maxVowelStreak = Math.max(maxVowelStreak, vowelStreak);
            } else if (consonants.includes(char)) {
                consonantStreak++;
                vowelStreak = 0;
                maxConsonantStreak = Math.max(maxConsonantStreak, consonantStreak);
            }
        }
        
        if (maxConsonantStreak > 4 || maxVowelStreak > 3) {
            trashScore += 4;
            issues.push('Unnatural letter patterns (possible gibberish)');
        }
        
        // 5. Check for common spam phrases
        const spamPhrases = [
            'test test test',
            'lorem ipsum',
            'asdf',
            'qwerty',
            '123',
            'aaa',
            'hello world',
            'sample text',
            'placeholder'
        ];
        
        spamPhrases.forEach(phrase => {
            if (cleanText.includes(phrase)) {
                trashScore += 5;
                issues.push(`Common spam phrase: "${phrase}"`);
            }
        });
        
        // 6. Check for extremely vague content and non-descriptive phrases
        const vaguePhrases = [
            /^(test|check|verify|confirm)\s*$/,
            /^(good|bad|ok|fine|nice)\s*$/,
            /^(yes|no|maybe|sure)\s*$/,
            /^this is a test/i,  // "This is a test" variations
            /^test case/i,       // Just "test case" without details
            /^a test/i,          // "A test" without specifics
            /^testing/i,         // Just "testing" 
            /^sample test/i,     // "Sample test" without content
            /^example test/i     // "Example test" without details
        ];
        
        if (vaguePhrases.some(pattern => pattern.test(cleanText))) {
            trashScore += 8;
            issues.push('Extremely vague or non-descriptive content');
        }
        
        // 6b. Check for insufficient test case structure
        const hasAction = /(click|enter|select|submit|navigate|open|press|type|input)/i.test(cleanText);
        const hasExpectedResult = /(should|will|expect|result|display|show|appear|return)/i.test(cleanText);
        const hasSpecificDetails = /(login|password|email|button|field|form|page|data|user|system)/i.test(cleanText);
        
        if (cleanText.length > 15 && (!hasAction && !hasExpectedResult)) {
            trashScore += 6;
            issues.push('Missing test actions or expected results');
        }
        
        if (cleanText.length > 30 && !hasSpecificDetails) {
            trashScore += 5;
            issues.push('Lacks specific testing details');
        }
        
        // 7. Check sentence structure quality
        const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
        if (sentences.length === 0) {
            trashScore += 3;
            issues.push('No complete sentences');
        }
        
        // 8. Check for excessive punctuation or special characters
        const specialCharRatio = (cleanText.match(/[^a-zA-Z0-9\s]/g) || []).length / cleanText.length;
        if (specialCharRatio > 0.3) {
            trashScore += 4;
            issues.push('Excessive special characters');
        }
        
        // 9. Enhanced minimum content requirements
        if (cleanText.length < 25) {
            trashScore += 5;
            issues.push('Content too short for meaningful test case');
        }
        
        // 10. Check for basic grammar and structure issues
        const grammarIssues = [
            /test cases$/i,  // "test cases" instead of "test case" 
            /^this is a test case$/i,  // Just stating it's a test case
            /^this is test/i,  // Poor grammar
            /^test for/i,      // Vague "test for..."
            /^testing the/i    // Vague "testing the..."
        ];
        
        if (grammarIssues.some(pattern => pattern.test(cleanText))) {
            trashScore += 7;
            issues.push('Poor grammar or extremely basic content');
        }
        
        // 11. Require substantial content for longer text
        if (cleanText.length >= 15) {
            const words = cleanText.split(/\s+/);
            const meaningfulWords = words.filter(word => 
                word.length > 3 && !['this', 'that', 'they', 'them', 'with', 'from', 'have', 'been'].includes(word)
            );
            
            if (meaningfulWords.length < 3) {
                trashScore += 6;
                issues.push('Insufficient meaningful content');
            }
        }
        
        return {
            isTrash: trashScore >= 10, // Threshold for rejecting content
            trashScore: trashScore,
            issues: issues,
            quality: trashScore < 4 ? 'good' : trashScore < 10 ? 'questionable' : 'poor'
        };
    },
    // Analyze sentence structure and completeness
    analyzeStructure(text) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = text.split(/\s+/).filter(w => w.length > 0);
        
        return {
            sentenceCount: sentences.length,
            wordCount: words.length,
            avgSentenceLength: sentences.length > 0 ? words.length / sentences.length : 0,
            hasComplexSentences: sentences.some(s => s.split(/[,;:]/).length > 2),
            hasBulletPoints: /[-•*]\s/.test(text),
            hasNumberedSteps: /\d+\.\s/.test(text)
        };
    },
    
    // Detect professional test case formats
    detectFormat(text) {
        const formats = {
            givenWhenThen: {
                pattern: /(given|when|then)/gi,
                score: 5,
                label: 'BDD Format (Given/When/Then)'
            },
            preConditionSteps: {
                pattern: /(precondition|pre-condition|setup|prerequisite)/gi,
                score: 3,
                label: 'Precondition Structure'
            },
            stepByStep: {
                pattern: /step\s*\d+|^\d+\.|first|second|third|next|finally/gi,
                score: 4,
                label: 'Step-by-step Format'
            },
            testData: {
                pattern: /(test\s*data|input\s*data|sample\s*data)/gi,
                score: 2,
                label: 'Test Data Specified'
            },
            expectedResult: {
                pattern: /(expected\s*result|expected\s*outcome|should\s*(display|show|return))/gi,
                score: 4,
                label: 'Clear Expected Results'
            }
        };
        
        let detectedFormats = [];
        let formatScore = 0;
        
        Object.entries(formats).forEach(([key, format]) => {
            if (format.pattern.test(text)) {
                detectedFormats.push(format.label);
                formatScore += format.score;
            }
        });
        
        return { detectedFormats, formatScore };
    },
    
    // Assess test case completeness
    assessCompleteness(text, category) {
        const components = {
            testObjective: {
                keywords: ['test', 'verify', 'validate', 'check', 'ensure', 'confirm'],
                weight: 3,
                label: 'Test Objective'
            },
            testSteps: {
                keywords: ['step', 'action', 'click', 'enter', 'select', 'navigate', 'open'],
                weight: 4,
                label: 'Test Steps'
            },
            testData: {
                keywords: ['data', 'input', 'value', 'parameter', 'field', 'username', 'password', 'email'],
                weight: 2,
                label: 'Test Data'
            },
            expectedResults: {
                keywords: ['expect', 'should', 'will', 'result', 'output', 'display', 'message', 'redirect'],
                weight: 4,
                label: 'Expected Results'
            },
            errorHandling: {
                keywords: ['error', 'warning', 'alert', 'exception', 'fail', 'invalid'],
                weight: category === 'negative' ? 4 : 2,
                label: 'Error Handling'
            }
        };
        
        let completenessScore = 0;
        let presentComponents = [];
        let missingComponents = [];
        
        Object.entries(components).forEach(([key, component]) => {
            const hasComponent = component.keywords.some(keyword => 
                text.toLowerCase().includes(keyword.toLowerCase())
            );
            
            if (hasComponent) {
                completenessScore += component.weight;
                presentComponents.push(component.label);
            } else {
                missingComponents.push(component.label);
            }
        });
        
        return { completenessScore, presentComponents, missingComponents };
    },
    
    // Calculate readability and clarity
    assessReadability(text) {
        const words = text.split(/\s+/).filter(w => w.length > 0);
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const complexWords = words.filter(w => w.length > 6).length;
        const avgWordsPerSentence = sentences.length > 0 ? words.length / sentences.length : 0;
        
        // Simple readability score (0-10)
        let readabilityScore = 10;
        if (avgWordsPerSentence > 20) readabilityScore -= 2;
        if (complexWords / words.length > 0.3) readabilityScore -= 2;
        if (text.length > 300) readabilityScore -= 1;
        
        const clarity = {
            score: Math.max(0, readabilityScore),
            avgWordsPerSentence: Math.round(avgWordsPerSentence * 10) / 10,
            complexWordRatio: Math.round((complexWords / words.length) * 100),
            recommendations: []
        };
        
        if (avgWordsPerSentence > 15) clarity.recommendations.push('Consider shorter sentences');
        if (complexWords / words.length > 0.25) clarity.recommendations.push('Use simpler terminology');
        if (sentences.length < 2) clarity.recommendations.push('Add more detail with multiple sentences');
        
        return clarity;
    },
    
    // Generate intelligent suggestions
    generateSuggestions(text, category, analysis) {
        let suggestions = [];
        
        // Format suggestions
        if (!analysis.format.detectedFormats.length) {
            suggestions.push({
                type: 'format',
                priority: 'high',
                suggestion: 'Consider using Given/When/Then format for better structure',
                example: 'Given: User is logged in\nWhen: User clicks submit\nThen: Success message displays'
            });
        }
        
        // Completeness suggestions
        if (analysis.completeness.missingComponents.includes('Expected Results')) {
            suggestions.push({
                type: 'completeness',
                priority: 'high',
                suggestion: 'Add clear expected results',
                example: 'Expected Result: The system should display...'
            });
        }
        
        if (analysis.completeness.missingComponents.includes('Test Steps')) {
            suggestions.push({
                type: 'completeness',
                priority: 'medium',
                suggestion: 'Include specific test steps',
                example: '1. Navigate to login page\n2. Enter credentials\n3. Click login button'
            });
        }
        
        // Category-specific suggestions
        const categoryAdvice = {
            positive: 'Focus on valid inputs and successful outcomes',
            negative: 'Emphasize invalid inputs and error scenarios',
            boundary: 'Test edge cases and limits (min/max values)',
            security: 'Include security threats and access control checks'
        };
        
        if (text.length < 50) {
            suggestions.push({
                type: 'detail',
                priority: 'medium',
                suggestion: `Add more detail for ${category} testing`,
                example: categoryAdvice[category]
            });
        }
        
        return suggestions;
    }
};

function scoreCustomTestCase(testCaseText, category) {
    const text = testCaseText.toLowerCase();
    
    // First check for trash data - reject completely if detected
    const trashCheck = TextAnalyzer.detectTrashData(testCaseText);
    
    if (trashCheck.isTrash) {
        return {
            points: 0,
            breakdown: ['❌ Content rejected: ' + trashCheck.issues.join(', ')],
            analysis: {
                trashCheck,
                isRejected: true,
                structure: { sentenceCount: 0, wordCount: 0 },
                format: { detectedFormats: [], formatScore: 0 },
                completeness: { completenessScore: 0, presentComponents: [], missingComponents: [] },
                readability: { score: 0, recommendations: [] },
                suggestions: [{
                    type: 'quality',
                    priority: 'critical',
                    suggestion: 'Please provide a detailed, specific test case',
                    example: 'Example: "User enters valid email (test@example.com) and correct password, clicks login button, system should display welcome message and redirect to dashboard"'
                }]
            }
        };
    }
    
    let baseScore = 5; // Minimum score
    let bonusPoints = 0;
    let breakdown = [];
    
    // Apply quality penalty if questionable but not completely trash
    if (trashCheck.quality === 'questionable') {
        baseScore = Math.max(3, baseScore - 2);
        breakdown.push('⚠️ Quality concerns (-2)');
    }
    
    // Perform comprehensive analysis
    const structure = TextAnalyzer.analyzeStructure(testCaseText);
    const format = TextAnalyzer.detectFormat(testCaseText);
    const completeness = TextAnalyzer.assessCompleteness(testCaseText, category);
    const readability = TextAnalyzer.assessReadability(testCaseText);
    const suggestions = TextAnalyzer.generateSuggestions(testCaseText, category, { format, completeness });
    
    // Length and detail bonus (up to 5 points) - Enhanced
    if (testCaseText.length >= 50) {
        bonusPoints += 2;
        breakdown.push('Good detail (+2)');
    }
    if (testCaseText.length >= 100) {
        bonusPoints += 3;
        breakdown.push('Comprehensive (+3)');
    }
    
    // Professional format bonus (up to 5 points)
    if (format.formatScore > 0) {
        const formatBonus = Math.min(5, Math.ceil(format.formatScore / 3));
        bonusPoints += formatBonus;
        breakdown.push(`Professional format (+${formatBonus})`);
    }
    
    // Completeness bonus (up to 6 points)
    if (completeness.completenessScore > 0) {
        const completenessBonus = Math.min(6, Math.ceil(completeness.completenessScore / 2));
        bonusPoints += completenessBonus;
        breakdown.push(`Complete structure (+${completenessBonus})`);
    }
    
    // Structure bonus (up to 3 points)
    if (structure.hasNumberedSteps || structure.hasBulletPoints) {
        bonusPoints += 2;
        breakdown.push('Well-organized (+2)');
    }
    if (structure.sentenceCount >= 3) {
        bonusPoints += 1;
        breakdown.push('Multi-step process (+1)');
    }
    
    // Structure and quality indicators (up to 8 points)
    const qualityIndicators = [
        { keywords: ['should', 'must', 'will', 'expect'], bonus: 2, label: 'Clear expectations' },
        { keywords: ['verify', 'check', 'confirm', 'ensure'], bonus: 2, label: 'Verification focus' },
        { keywords: ['input', 'enter', 'submit', 'click'], bonus: 1, label: 'Action steps' },
        { keywords: ['result', 'output', 'response', 'message', 'display'], bonus: 2, label: 'Expected results' },
        { keywords: ['error', 'warning', 'alert', 'notification'], bonus: 1, label: 'Error handling' }
    ];
    
    qualityIndicators.forEach(indicator => {
        if (indicator.keywords.some(keyword => text.includes(keyword))) {
            bonusPoints += indicator.bonus;
            breakdown.push(`${indicator.label} (+${indicator.bonus})`);
        }
    });
    
    // Category-specific keywords (up to 7 points)
    const categoryKeywords = {
        positive: [
            { keywords: ['valid', 'correct', 'successful', 'accept'], bonus: 2, label: 'Valid inputs' },
            { keywords: ['login', 'save', 'submit', 'create'], bonus: 1, label: 'Happy path actions' },
            { keywords: ['welcome', 'success', 'complete', 'redirect'], bonus: 2, label: 'Success outcomes' }
        ],
        negative: [
            { keywords: ['invalid', 'incorrect', 'empty', 'missing'], bonus: 2, label: 'Invalid inputs' },
            { keywords: ['error', 'fail', 'reject', 'block'], bonus: 2, label: 'Error scenarios' },
            { keywords: ['prevent', 'deny', 'restrict'], bonus: 2, label: 'Prevention logic' }
        ],
        boundary: [
            { keywords: ['limit', 'maximum', 'minimum', 'exactly'], bonus: 3, label: 'Boundary values' },
            { keywords: ['character', 'length', 'size', 'count'], bonus: 2, label: 'Size limits' },
            { keywords: ['edge', 'boundary', 'threshold'], bonus: 2, label: 'Edge cases' }
        ],
        security: [
            { keywords: ['injection', 'sql', 'xss', 'script'], bonus: 4, label: 'Attack vectors' },
            { keywords: ['unauthorized', 'permission', 'access', 'authentication'], bonus: 3, label: 'Access controls' },
            { keywords: ['encrypt', 'hash', 'secure', 'protect'], bonus: 2, label: 'Security measures' }
        ]
    };
    
    if (categoryKeywords[category]) {
        categoryKeywords[category].forEach(indicator => {
            if (indicator.keywords.some(keyword => text.includes(keyword))) {
                bonusPoints += indicator.bonus;
                breakdown.push(`${indicator.label} (+${indicator.bonus})`);
            }
        });
    }
    
    // Specific format bonuses (up to 5 points)
    if (text.includes('precondition') || text.includes('given')) {
        bonusPoints += 2;
        breakdown.push('Preconditions (+2)');
    }
    if (text.includes('step') || text.includes('procedure')) {
        bonusPoints += 2;
        breakdown.push('Test steps (+2)');
    }
    if (text.includes('expected') || text.includes('actual')) {
        bonusPoints += 1;
        breakdown.push('Result comparison (+1)');
    }
    
    // Cap total score at 25
    const totalScore = Math.min(25, baseScore + bonusPoints);
    
    // Store comprehensive analysis for display
    const analysis = {
        trashCheck,
        structure,
        format,
        completeness,
        readability,
        suggestions,
        score: totalScore,
        breakdown: breakdown,
        isRejected: false
    };
    
    return {
        points: totalScore,
        breakdown: breakdown,
        analysis: analysis // Include full analysis
    };
}

function displayCustomTestCase(customTestCase, category) {
    const listContainer = document.getElementById(`custom${category.charAt(0).toUpperCase() + category.slice(1)}List`);
    
    const testItem = document.createElement('div');
    testItem.className = 'custom-test-item';
    testItem.id = customTestCase.id;
    
    // Enhanced display with analysis details
    const analysis = customTestCase.analysis || {};
    const suggestions = analysis.suggestions || [];
    const trashCheck = analysis.trashCheck || {};
    
    // Quality indicator
    let qualityIndicator = '';
    if (trashCheck.quality === 'questionable') {
        qualityIndicator = `<div class="quality-warning">⚠️ Quality concerns detected</div>`;
    } else if (trashCheck.quality === 'good') {
        qualityIndicator = `<div class="quality-good">✅ Good quality content</div>`;
    }
    
    const detectedFormatsText = analysis.format?.detectedFormats?.length > 0 
        ? `<div class="analysis-highlight">✅ ${analysis.format.detectedFormats.join(', ')}</div>` 
        : '';
    const suggestionsText = suggestions.length > 0 
        ? `<div class="analysis-suggestions">💡 ${suggestions.slice(0, 2).map(s => s.suggestion).join(' • ')}</div>` 
        : '';
    
    testItem.innerHTML = `
        <button class="remove-custom-test" onclick="removeCustomTestCase('${customTestCase.id}', '${category}')">×</button>
        <div class="custom-test-content">${customTestCase.text}</div>
        ${qualityIndicator}
        ${detectedFormatsText}
        ${suggestionsText}
        <div class="custom-test-score">
            <span class="score-breakdown">${customTestCase.breakdown.join(', ')}</span>
            <span class="score-badge">+${customTestCase.points} pts</span>
        </div>
    `;
    
    listContainer.appendChild(testItem);
}

function removeCustomTestCase(customId, category) {
    // Find the custom test case to get its points
    const customTestCase = currentGame.customTestCases.find(tc => tc.id === customId);
    
    // Remove from game state
    currentGame.customTestCases = currentGame.customTestCases.filter(tc => tc.id !== customId);
    currentGame.selectedTestCases = currentGame.selectedTestCases.filter(tc => tc.id !== customId);
    
    // Subtract points from current score
    if (customTestCase) {
        currentGame.totalScore -= customTestCase.points;
        document.getElementById('scoreValue').textContent = currentGame.totalScore;
    }
    
    // Remove from DOM
    const element = document.getElementById(customId);
    if (element) {
        element.remove();
    }
    
    // Update coverage
    updateCoverage();
}

function updateCoverage() {
    const feature = currentGame.features[currentGame.currentFeatureIndex];
    const coverage = calculateQualityCoverage(feature.testCases, currentGame.selectedTestCases);
    
    // Update visual elements
    document.getElementById('coverageFill').style.width = `${coverage.percentage}%`;
    document.getElementById('coveragePercent').textContent = `${coverage.percentage}%`;
    
    // Update quality label
    const qualityLabel = getQualityLabel(coverage.percentage);
    const qualityElement = document.getElementById('coverageQuality');
    qualityElement.textContent = qualityLabel.text;
    qualityElement.className = `coverage-quality-label ${qualityLabel.class}`;
    
    // Update tooltip breakdown
    document.getElementById('tooltipEssential').textContent = `${coverage.breakdown.essential}%`;
    document.getElementById('tooltipBalance').textContent = `${coverage.breakdown.balance}%`;
    document.getElementById('tooltipEfficiency').textContent = `${coverage.breakdown.efficiency}%`;
}

function getQualityLabel(percentage) {
    if (percentage >= 85) return { text: 'Excellent', class: 'quality-excellent' };
    if (percentage >= 70) return { text: 'Good', class: 'quality-good' };
    if (percentage >= 50) return { text: 'Fair', class: 'quality-fair' };
    return { text: 'Needs Work', class: 'quality-poor' };
}

function calculateQualityCoverage(allTestCases, selectedTestCases) {
    const categories = ['positive', 'negative', 'boundary', 'security'];
    let totalScore = 0;
    let maxPossibleScore = 0;
    
    // Category coverage weights (ensures balanced testing approach)
    const categoryWeights = {
        positive: 0.25,    // 25% - Happy path coverage
        negative: 0.30,    // 30% - Error handling (critical)
        boundary: 0.25,    // 25% - Edge cases
        security: 0.20     // 20% - Security testing
    };
    
    // Calculate coverage for each category
    categories.forEach(category => {
        const categoryTests = allTestCases[category] || [];
        const selectedFromCategory = selectedTestCases.filter(selected => 
            categoryTests.some(test => test.id === selected.id)
        );
        
        if (categoryTests.length === 0) return;
        
        // Calculate category metrics
        const essentialTests = categoryTests.filter(test => test.essential);
        const selectedEssential = selectedFromCategory.filter(selected =>
            essentialTests.some(test => test.id === selected.id)
        );
        
        // Quality scoring for this category
        let categoryScore = 0;
        let categoryMaxScore = 100;
        
        // Essential coverage (60% of category score)
        const essentialCoverage = essentialTests.length > 0 ? 
            (selectedEssential.length / essentialTests.length) : 1;
        categoryScore += essentialCoverage * 60;
        
        // Overall category coverage (40% of category score)
        // Diminishing returns after 70% to discourage selecting everything
        const rawCoverage = selectedFromCategory.length / categoryTests.length;
        const adjustedCoverage = rawCoverage <= 0.7 ? 
            rawCoverage : 0.7 + (rawCoverage - 0.7) * 0.3;
        categoryScore += adjustedCoverage * 40;
        
        // Apply category weight to total score
        totalScore += categoryScore * categoryWeights[category];
        maxPossibleScore += categoryMaxScore * categoryWeights[category];
    });
    
    // Bonus for balanced selection (having cases from all categories)
    const categoriesWithSelections = categories.filter(category => {
        const categoryTests = allTestCases[category] || [];
        return selectedTestCases.some(selected => 
            categoryTests.some(test => test.id === selected.id)
        );
    });
    
    const balanceBonus = categoriesWithSelections.length === 4 ? 10 : 
                        categoriesWithSelections.length === 3 ? 5 : 0;
    
    totalScore += balanceBonus;
    maxPossibleScore += 10;
    
    // Penalty for over-selection (selecting too many non-essential cases)
    const totalSelected = selectedTestCases.length;
    const totalEssential = categories.reduce((count, category) => {
        return count + (allTestCases[category]?.filter(test => test.essential)?.length || 0);
    }, 0);
    
    if (totalSelected > totalEssential * 1.8) { // More than 80% extra
        const overSelectionPenalty = Math.min(15, (totalSelected - totalEssential * 1.8) * 2);
        totalScore -= overSelectionPenalty;
    }
    
    // Calculate final percentage (capped at 100%)
    const percentage = Math.min(100, Math.max(0, Math.round((totalScore / maxPossibleScore) * 100)));
    
    return {
        percentage,
        breakdown: {
            essential: Math.round(categories.reduce((acc, category) => {
                const essentialTests = allTestCases[category]?.filter(test => test.essential) || [];
                const selectedEssential = selectedTestCases.filter(selected => 
                    essentialTests.some(test => test.id === selected.id)
                );
                return acc + (essentialTests.length > 0 ? selectedEssential.length / essentialTests.length : 1);
            }, 0) / categories.length * 100),
            balance: Math.round(categoriesWithSelections.length / 4 * 100),
            efficiency: totalSelected <= totalEssential * 1.5 ? 100 : 
                       Math.max(0, 100 - (totalSelected - totalEssential * 1.5) * 5)
        }
    };
}

function getHint() {
    currentGame.hintsUsed++;
    
    const feature = currentGame.features[currentGame.currentFeatureIndex];
    const coverage = calculateQualityCoverage(feature.testCases, currentGame.selectedTestCases);
    
    let hintText;
    
    // Analyze coverage breakdown to provide targeted hints
    if (coverage.breakdown.essential < 70) {
        hintText = "Focus on essential test cases first - they're marked as critical for good coverage. Look for tests that could cause major failures if missed.";
    } else if (coverage.breakdown.balance < 75) {
        hintText = "Try to include test cases from all four categories (Positive, Negative, Boundary, Security) for balanced coverage. Each category tests different aspects.";
    } else if (coverage.breakdown.efficiency < 80) {
        hintText = "You might be over-selecting. Focus on the most important test cases rather than trying to select everything. Quality over quantity!";
    } else if (coverage.percentage < 60) {
        // Analyze which categories are weakest
        const categories = ['positive', 'negative', 'boundary', 'security'];
        const categoryScores = categories.map(category => {
            const categoryTests = feature.testCases[category] || [];
            const selectedFromCategory = currentGame.selectedTestCases.filter(selected => 
                categoryTests.some(test => test.id === selected.id)
            );
            return {
                category,
                score: categoryTests.length > 0 ? selectedFromCategory.length / categoryTests.length : 1
            };
        });
        
        const weakestCategory = categoryScores.reduce((min, current) => 
            current.score < min.score ? current : min
        );
        
        if (hints[weakestCategory.category]) {
            const categoryHints = hints[weakestCategory.category];
            hintText = categoryHints[Math.floor(Math.random() * categoryHints.length)];
        } else {
            hintText = "Consider the different types of testing: positive (happy path), negative (error cases), boundary (edge cases), and security (vulnerabilities).";
        }
    } else {
        const generalHints = [
            "You're doing well! Consider if you've covered the most critical failure scenarios.",
            "Think about real-world usage - what could go wrong in production?",
            "Good progress! Make sure you're not missing any essential security considerations.",
            "Nice coverage! Double-check that you have adequate error handling tests."
        ];
        hintText = generalHints[Math.floor(Math.random() * generalHints.length)];
    }
    
    showHintPopup(hintText);
}

function showHintPopup(text) {
    const overlay = document.createElement('div');
    overlay.className = 'hint-overlay';
    
    const popup = document.createElement('div');
    popup.className = 'hint-popup scale-in';
    popup.innerHTML = `
        <h4>💡 Hint</h4>
        <p>${text}</p>
        <button onclick="closeHint()" style="margin-top: 15px; padding: 8px 16px; background: #feca57; border: none; border-radius: 5px; cursor: pointer;">Got it!</button>
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
    
    overlay.onclick = closeHint;
}

function closeHint() {
    const overlay = document.querySelector('.hint-overlay');
    const popup = document.querySelector('.hint-popup');
    if (overlay) overlay.remove();
    if (popup) popup.remove();
}

function submitTestCases() {
    if (currentGame.selectedTestCases.length === 0) {
        alert('Please select at least one test case before submitting!');
        return;
    }
    
    const results = calculateScore();
    showResults(results);
}

function calculateScore() {
    const feature = currentGame.features[currentGame.currentFeatureIndex];
    const allTestCases = Object.values(feature.testCases).flat();
    
    let score = 0;
    let essentialMissed = 0;
    let totalPossible = 0;
    let selectedCorrect = 0;
    let missedCases = [];
    let customTestCaseScore = 0;
    
    // Calculate score for selected predefined test cases
    currentGame.selectedTestCases.forEach(selected => {
        const testCase = allTestCases.find(tc => tc.id === selected.id);
        if (testCase) {
            score += testCase.points;
            selectedCorrect++;
            totalPossible += testCase.points;
        }
    });
    
    // Add score from custom test cases (already added to totalScore when created)
    currentGame.customTestCases.forEach(customTestCase => {
        customTestCaseScore += customTestCase.points;
    });
    
    // Check for missed essential test cases
    allTestCases.forEach(testCase => {
        const isSelected = currentGame.selectedTestCases.some(selected => selected.id === testCase.id);
        
        if (!isSelected) {
            if (testCase.essential) {
                essentialMissed++;
                missedCases.push({
                    text: testCase.text,
                    points: testCase.points,
                    essential: true
                });
            } else if (testCase.points >= 15) {
                missedCases.push({
                    text: testCase.text,
                    points: testCase.points,
                    essential: false
                });
            }
        }
        totalPossible += testCase.points;
    });
    
    // Apply penalties for missed essential cases
    const penalty = essentialMissed * 20;
    score = Math.max(0, score - penalty);
    
    // Apply hint penalty
    const hintPenalty = currentGame.hintsUsed * 5;
    score = Math.max(0, score - hintPenalty);
    
    currentGame.score = score;
    // Note: Don't add to totalScore here as custom test cases are already added
    
    return {
        score,
        customTestCaseScore,
        totalPossible,
        selectedCorrect,
        totalTests: allTestCases.length,
        customTestCount: currentGame.customTestCases.length,
        essentialMissed,
        missedCases,
        coverage: Math.round((selectedCorrect / allTestCases.length) * 100)
    };
}

function showResults(results) {
    document.getElementById('gamePlay').classList.add('hidden');
    document.getElementById('gameResults').classList.remove('hidden');
    
    const title = document.getElementById('resultsTitle');
    const summary = document.getElementById('resultsSummary');
    const missedSection = document.getElementById('missedCases');
    
    title.textContent = `Feature ${currentGame.currentFeatureIndex + 1} Results`;
    
    // Get coverage breakdown for detailed results
    const feature = currentGame.features[currentGame.currentFeatureIndex];
    const coverageDetails = calculateQualityCoverage(feature.testCases, currentGame.selectedTestCases);
    const qualityLabel = getQualityLabel(coverageDetails.percentage);
    
    // Results summary
    summary.innerHTML = `
        <div class="results-item">
            <span>🎯 Predefined Cases Score:</span>
            <span><strong>${results.score} points</strong></span>
        </div>
        ${results.customTestCount > 0 ? `
        <div class="results-item">
            <span>✍️ Custom Test Cases:</span>
            <span><strong>${results.customTestCount} cases (+${results.customTestCaseScore} pts)</strong></span>
        </div>
        ` : ''}
        <div class="results-item">
            <span>📊 Test Quality:</span>
            <span class="${qualityLabel.class}"><strong>${coverageDetails.percentage}% (${qualityLabel.text})</strong></span>
        </div>
        <div class="results-item">
            <span>⭐ Essential Coverage:</span>
            <span>${coverageDetails.breakdown.essential}%</span>
        </div>
        <div class="results-item">
            <span>⚖️ Category Balance:</span>
            <span>${coverageDetails.breakdown.balance}%</span>
        </div>
        <div class="results-item">
            <span>🎯 Selection Efficiency:</span>
            <span>${coverageDetails.breakdown.efficiency}%</span>
        </div>
        <div class="results-item">
            <span>⚠️ Essential Cases Missed:</span>
            <span>${results.essentialMissed}</span>
        </div>
        <div class="results-item">
            <span>💡 Hints Used:</span>
            <span>${currentGame.hintsUsed}</span>
        </div>
        <div class="results-item">
            <span>📈 Total Score:</span>
            <span><strong>${currentGame.totalScore} points</strong></span>
        </div>
    `;
    
    // Missed cases
    if (results.missedCases.length > 0) {
        missedSection.innerHTML = `
            <h4>💭 Important Test Cases You Might Have Missed:</h4>
            ${results.missedCases.map(missed => `
                <div class="missed-case-item">
                    <strong>${missed.essential ? '🚨 Essential: ' : '⭐ High Value: '}</strong>
                    ${missed.text} (${missed.points} points)
                </div>
            `).join('')}
        `;
    } else {
        missedSection.innerHTML = `
            <div class="success-highlight" style="padding: 15px; border-radius: 8px;">
                <h4>🎉 Excellent! You didn't miss any important test cases!</h4>
            </div>
        `;
    }
}

function nextFeature() {
    currentGame.currentFeatureIndex++;
    
    if (currentGame.currentFeatureIndex >= currentGame.features.length) {
        // Game complete
        completeGame();
    } else {
        // Load next feature
        document.getElementById('gameResults').classList.add('hidden');
        document.getElementById('gamePlay').classList.remove('hidden');
        loadCurrentFeature();
    }
}

function completeGame() {
    const endTime = Date.now();
    const playTime = Math.round((endTime - currentGame.startTime) / 1000);
    
    // Calculate final metrics
    const efficiency = Math.round((currentGame.totalScore / (currentGame.features.length * 200)) * 100);
    const timeBonus = Math.max(0, 300 - playTime);
    const finalScore = currentGame.totalScore + timeBonus;
    
    const gameDetails = {
        difficulty: currentGame.difficulty,
        features_completed: currentGame.features.length,
        total_score: currentGame.totalScore,
        time_bonus: timeBonus,
        final_score: finalScore,
        efficiency: efficiency + '%',
        hints_used: currentGame.hintsUsed,
        play_time: playTime + 's'
    };
    
    // Check for leaderboard qualification
    if (window.gameLeaderboard && window.gameLeaderboard.qualifiesForLeaderboard('test-case-designer', finalScore)) {
        window.gameLeaderboard.showNameInput('test-case-designer', finalScore, gameDetails, 'high')
            .then(result => {
                showFinalResults(finalScore, playTime, efficiency, result.submitted ? result.playerName : null);
            });
    } else {
        showFinalResults(finalScore, playTime, efficiency);
    }
}

function showFinalResults(finalScore, playTime, efficiency, playerName = null) {
    const summary = document.getElementById('resultsSummary');
    const missedSection = document.getElementById('missedCases');
    
    document.getElementById('resultsTitle').textContent = '🏆 Game Complete!';
    
    summary.innerHTML = `
        <div class="results-item">
            <span>🎯 Final Score:</span>
            <span><strong>${finalScore} points</strong></span>
        </div>
        <div class="results-item">
            <span>⏱️ Time Taken:</span>
            <span>${playTime} seconds</span>
        </div>
        <div class="results-item">
            <span>📊 Efficiency:</span>
            <span>${efficiency}%</span>
        </div>
        <div class="results-item">
            <span>🎮 Difficulty:</span>
            <span>${currentGame.difficulty.charAt(0).toUpperCase() + currentGame.difficulty.slice(1)}</span>
        </div>
        <div class="results-item">
            <span>🎯 Features Completed:</span>
            <span>${currentGame.features.length}</span>
        </div>
        ${playerName ? `
        <div class="results-item success-highlight">
            <span>🏆 Leaderboard Entry:</span>
            <span><strong>${playerName}</strong></span>
        </div>
        ` : ''}
    `;
    
    missedSection.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <h3>🧪 Test Case Design Skills Assessment</h3>
            <p>${getSkillAssessment(efficiency)}</p>
        </div>
    `;
}

function getSkillAssessment(efficiency) {
    if (efficiency >= 90) {
        return "🌟 Exceptional! You have excellent test case design skills. You understand the importance of comprehensive testing coverage.";
    } else if (efficiency >= 75) {
        return "🎯 Great job! You have strong testing fundamentals. Focus on edge cases and security testing for improvement.";
    } else if (efficiency >= 60) {
        return "👍 Good work! You understand basic testing principles. Consider practicing boundary value analysis and negative testing.";
    } else if (efficiency >= 40) {
        return "📚 Keep learning! Focus on understanding different types of test cases and their importance in quality assurance.";
    } else {
        return "🎓 Great start! Consider studying software testing fundamentals and practicing with real-world scenarios.";
    }
}

function restartGame() {
    backToSelection();
}

function backToSelection() {
    document.getElementById('gamePlay').classList.add('hidden');
    document.getElementById('gameResults').classList.add('hidden');
    document.getElementById('gameSelection').classList.remove('hidden');
    
    // Reset game state
    currentGame = {
        difficulty: '',
        currentFeatureIndex: 0,
        features: [],
        selectedTestCases: [],
        customTestCases: [],
        score: 0,
        totalScore: 0,
        hintsUsed: 0,
        startTime: null
    };
    
    // Reset swipe state
    swipeState = {
        currentCategory: 0,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        isDragging: false,
        hasSwipeHintShown: false
    };
}

function showGameLeaderboard() {
    if (window.gameLeaderboard) {
        window.gameLeaderboard.showLeaderboard('test-case-designer');
    } else {
        alert('Leaderboard system not available');
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add test-case-designer to leaderboard system
    if (window.gameLeaderboard && window.gameLeaderboard.getGameTitle) {
        const originalGetGameTitle = window.gameLeaderboard.getGameTitle;
        window.gameLeaderboard.getGameTitle = function(gameId) {
            if (gameId === 'test-case-designer') {
                return 'Test Case Designer';
            }
            return originalGetGameTitle(gameId);
        };
    }
});