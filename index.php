<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Work Time Tracker</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Roboto+Mono:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Roboto', sans-serif;
            background-color: #f8f9fa;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        
        .app-container {
            max-width: 800px;
            margin: 0 auto;
        }
        
        .card {
            border: none;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .card-header {
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            color: white;
            border-radius: 15px 15px 0 0 !important;
            padding: 1.5rem;
        }
        
        .timer-display {
            font-family: 'Roboto Mono', monospace;
            font-size: 4rem;
            font-weight: 700;
            color: #343a40;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }
        
        .timer-active {
            color: #dc3545;
        }
        
        @keyframes pulse {
            0% {
                transform: scale(1);
                opacity: 1;
            }
            50% {
                transform: scale(1.05);
                opacity: 0.8;
            }
            100% {
                transform: scale(1);
                opacity: 1;
            }
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
            border: none;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        }
        
        .btn-danger {
            background: linear-gradient(135deg, #cb2d3e 0%, #ef473a 100%);
            border: none;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        }
        
        .btn-danger:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        }
        
        .btn-success {
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            border: none;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        }
        
        .btn-success:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
        }
        
        .timeline-container {
            height: 60px;
            position: relative;
            padding: 10px;
        }
        
        .timeline-bar {
            height: 25px;
            background-color: #e9ecef;
            border-radius: 12px;
            position: relative;
            overflow: hidden;
            box-shadow: inset 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .timeline-segment {
            position: absolute;
            height: 100%;
            background-color: #0d6efd;
            border-radius: 12px;
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        
        .timeline-segment:hover {
            transform: scaleY(1.1);
            z-index: 10;
        }
        
        .timeline-tooltip {
            position: absolute;
            bottom: 120%;
            transform: translateX(-50%);
            background-color: #343a40;
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 12px;
            white-space: pre-wrap;
            display: none;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 100;
            max-width: 200px;
        }
        
        .timeline-tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: #343a40 transparent transparent transparent;
        }
        
        .section-title {
            position: relative;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        
        .section-title::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 50px;
            height: 3px;
            background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
        }
        
        .list-group-item {
            border-left: none;
            border-right: none;
            transition: all 0.2s ease;
        }
        
        .list-group-item:hover {
            background-color: #f8f9fa;
            transform: translateX(5px);
        }
        
        .note-dialog {
            border-left: 4px solid #2575fc;
            background-color: #f8f9fa;
        }
    </style>
</head>
<body>
    <div class="app-container py-5">
        <div class="card">
            <div class="card-header text-center">
                <h1 class="mb-0"><i class="fas fa-stopwatch me-2"></i>Work Time Tracker</h1>
            </div>
            <div class="card-body p-4">
                <div class="text-center mb-3">
                    <div class="badge bg-secondary fs-6 mb-3" id="currentTime"></div>
                    
                    <div class="timer-display text-center mb-4">00:00:00</div>
                    
                    <button id="timerButton" class="btn btn-primary btn-lg w-100 mb-4">
                        <i class="fas fa-play me-2"></i>Start
                    </button>
                </div>
                
                <div id="noteDialog" class="card note-dialog mb-4 d-none">
                    <div class="card-body">
                        <h3 class="card-title">
                            <i class="fas fa-edit me-2"></i>Work Notes
                        </h3>
                        <p class="text-muted">Describe what you worked on during this session</p>
                        
                        <div class="mb-3">
                            <label for="workTag" class="form-label"><i class="fas fa-tag me-2"></i>Work Category</label>
                            <div class="input-group">
                                <select id="workTag" class="form-select">
                                    <option value="">Select a category</option>
                                    <option value="Development">Development</option>
                                    <option value="Design">Design</option>
                                    <option value="Research">Research</option>
                                    <option value="Meeting">Meeting</option>
                                    <option value="Documentation">Documentation</option>
                                    <option value="Planning">Planning</option>
                                    <option value="Testing">Testing</option>
                                    <option value="Other">Other</option>
                                </select>
                                <button class="btn btn-outline-secondary" type="button" id="addNewTag">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <div id="newTagInput" class="mt-2 d-none">
                                <div class="input-group">
                                    <input type="text" id="customTag" class="form-control" placeholder="Enter new category">
                                    <button class="btn btn-outline-primary" type="button" id="saveNewTag">
                                        <i class="fas fa-check"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label for="workNotes" class="form-label"><i class="fas fa-comment-alt me-2"></i>Notes</label>
                            <textarea id="workNotes" class="form-control" placeholder="What did you work on? Be specific to help with your productivity tracking." rows="3"></textarea>
                        </div>
                        
                        <button id="saveNotes" class="btn btn-success btn-lg w-100">
                            <i class="fas fa-save me-2"></i>Save Session
                        </button>
                    </div>
                </div>
                
                <div class="mt-5">
                    <h2 class="section-title">
                        <i class="fas fa-chart-pie me-2"></i>Work Statistics
                    </h2>
                    
                    <div class="row mb-4">
                        <div class="col-md-6">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h5 class="card-title"><i class="fas fa-tags me-2"></i>Time by Category</h5>
                                    <div id="categoryStats" class="mt-3">
                                        <div class="text-center py-4 text-muted">
                                            <i class="fas fa-hourglass-start fs-4 mb-2"></i>
                                            <p>No data available yet</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="card h-100">
                                <div class="card-body">
                                    <h5 class="card-title"><i class="fas fa-calendar-week me-2"></i>Recent Activity</h5>
                                    <div id="recentStats" class="mt-3">
                                        <div class="text-center py-4 text-muted">
                                            <i class="fas fa-hourglass-start fs-4 mb-2"></i>
                                            <p>No data available yet</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <h2 class="section-title mt-5">
                        <i class="fas fa-history me-2"></i>Work History
                    </h2>
                    
                    <div class="mb-4">
                        <h5><i class="fas fa-chart-line me-2"></i>Activity Timeline</h5>
                        <div class="timeline-container bg-light rounded">
                            <div id="timelineBar" class="timeline-bar"></div>
                        </div>
                    </div>
                    
                    <div id="historyList" class="list-group"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Toast container for notifications -->
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11">
        <div id="saveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <i class="fas fa-bell me-2"></i>
                <strong class="me-auto">Work Tracker</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body" id="toastMessage"></div>
        </div>
    </div>

    <!-- Bootstrap JS Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script.js"></script>
</body>
</html>
