export const SCSS = `
/* Hide top bar */
.swagger-ui .top-bar { 
    display: none; 
}

/* Main dark theme */
.swagger-ui {
    background: linear-gradient(135deg, #0a0e16 0%, #0d1117 50%, #161b22 100%) !important;
    color: #f0f6fc !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    line-height: 1.6;
    min-height: 100vh;
}

/* Header styling with enhanced gradient */
.swagger-ui .info {
    margin: 30px 0 40px 0;
    padding: 30px;
    background: linear-gradient(135deg, #1f2937 0%, #111827 50%, #0f172a 100%);
    border: 1px solid #374151;
    border-radius: 16px;
    color: #f0f6fc;
    box-shadow: 
        0 20px 25px -5px rgba(0, 0, 0, 0.5),
        0 10px 10px -5px rgba(0, 0, 0, 0.04),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
    position: relative;
    overflow: hidden;
}

.swagger-ui .info::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899, #f59e0b);
}

.swagger-ui .info .title {
    color: #f0f6fc !important;
    font-size: 2.8rem;
    font-weight: 800;
    margin-bottom: 15px;
    background: linear-gradient(135deg, #f0f6fc 0%, #c9d1d9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: none;
    letter-spacing: -0.02em;
}

.swagger-ui .info .description {
    color: #8b949e;
    font-size: 1.15rem;
    margin: 20px 0;
    line-height: 1.7;
}

/* Enhanced operation styling */
.swagger-ui .opblock {
    background: rgba(22, 27, 34, 0.8) !important;
    border: 1px solid rgba(48, 54, 61, 0.5) !important;
    border-radius: 16px;
    margin-bottom: 24px;
    box-shadow: 
        0 10px 25px rgba(0, 0, 0, 0.2),
        0 4px 6px rgba(0, 0, 0, 0.1),
        inset 0 1px 0 rgba(255, 255, 255, 0.02);
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(8px);
    position: relative;
}

.swagger-ui .opblock::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
}

.swagger-ui .opblock:hover {
    box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.3),
        0 8px 16px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
    transform: translateY(-4px);
    border-color: rgba(88, 166, 255, 0.3) !important;
    background: rgba(22, 27, 34, 0.95) !important;
}

/* Enhanced HTTP method colors */
.swagger-ui .opblock.opblock-get {
    border-left: 4px solid #61affe !important;
    background: linear-gradient(135deg, rgba(97, 175, 254, 0.08) 0%, rgba(22, 27, 34, 0.8) 30%) !important;
}

.swagger-ui .opblock.opblock-post {
    border-left: 4px solid #49cc90 !important;
    background: linear-gradient(135deg, rgba(73, 204, 144, 0.08) 0%, rgba(22, 27, 34, 0.8) 30%) !important;
}

.swagger-ui .opblock.opblock-put {
    border-left: 4px solid #fca130 !important;
    background: linear-gradient(135deg, rgba(252, 161, 48, 0.08) 0%, rgba(22, 27, 34, 0.8) 30%) !important;
}

.swagger-ui .opblock.opblock-delete {
    border-left: 4px solid #f93e3e !important;
    background: linear-gradient(135deg, rgba(249, 62, 62, 0.08) 0%, rgba(22, 27, 34, 0.8) 30%) !important;
}

.swagger-ui .opblock.opblock-patch {
    border-left: 4px solid #9333ea !important;
    background: linear-gradient(135deg, rgba(147, 51, 234, 0.08) 0%, rgba(22, 27, 34, 0.8) 30%) !important;
}

/* Method badges */
.swagger-ui .opblock-summary-method {
    border-radius: 8px !important;
    font-weight: 700 !important;
    font-size: 0.75rem !important;
    padding: 6px 12px !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
}

.swagger-ui .opblock .opblock-summary {
    color: #f0f6fc !important;
    padding: 16px 20px !important;
    font-weight: 600;
}

.swagger-ui .opblock-description-wrapper,
.swagger-ui .opblock-external-docs-wrapper,
.swagger-ui .opblock-title_normal {
    color: #8b949e !important;
}

/* Enhanced button styling */
.swagger-ui .btn {
    border-radius: 10px;
    font-weight: 600;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-size: 0.8rem;
    position: relative;
    overflow: hidden;
}

.swagger-ui .btn.execute {
    background: linear-gradient(135deg, #238636 0%, #196127 100%) !important;
    border: none !important;
    color: white !important;
    padding: 12px 24px;
    box-shadow: 0 4px 12px rgba(35, 134, 54, 0.3);
}

.swagger-ui .btn.execute::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
}

.swagger-ui .btn.execute:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(35, 134, 54, 0.4) !important;
    background: linear-gradient(135deg, #2ea043 0%, #238636 100%) !important;
}

.swagger-ui .btn.execute:hover::before {
    left: 100%;
}

/* Enhanced parameters styling */
.swagger-ui .parameters-col_description,
.swagger-ui .parameter__name,
.swagger-ui .parameter__type {
    color: #8b949e !important;
}

.swagger-ui .parameter__name.required {
    color: #ff6b6b !important;
    font-weight: 600 !important;
}

.swagger-ui .parameter__name.required::after {
    content: ' *';
    color: #ff6b6b;
    font-weight: bold;
}

/* Response styling */
.swagger-ui .responses-inner {
    border-radius: 12px;
    overflow: hidden;
    background: rgba(22, 27, 34, 0.6) !important;
    border: 1px solid rgba(48, 54, 61, 0.5) !important;
    backdrop-filter: blur(4px);
}

.swagger-ui .response-col_status {
    font-weight: 700;
    color: #f0f6fc !important;
    padding: 12px !important;
}

/* Code blocks with syntax highlighting feel */
.swagger-ui .highlight-code {
    border-radius: 12px;
    background: #0a0e16 !important;
    border: 1px solid #30363d !important;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
    position: relative;
    overflow: hidden;
}

.swagger-ui .highlight-code::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 20px;
    background: linear-gradient(180deg, rgba(48, 54, 61, 0.3) 0%, transparent 100%);
}

.swagger-ui .microlight {
    color: #f0f6fc !important;
    font-family: 'JetBrains Mono', 'Fira Code', Monaco, monospace !important;
}

/* Models section */
.swagger-ui .model-box {
    border-radius: 12px;
    background: rgba(22, 27, 34, 0.6) !important;
    border: 1px solid rgba(48, 54, 61, 0.5) !important;
    color: #f0f6fc !important;
    backdrop-filter: blur(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.swagger-ui .model-title {
    color: #f0f6fc !important;
    font-weight: 700;
    font-size: 1.1rem;
}

.swagger-ui .prop-type {
    color: #79c0ff !important;
    font-weight: 600;
}

.swagger-ui .prop-format {
    color: #8b949e !important;
    font-style: italic;
}

/* Enhanced input fields */
.swagger-ui input[type=text],
.swagger-ui input[type=password],
.swagger-ui input[type=email],
.swagger-ui textarea,
.swagger-ui select {
    background: rgba(22, 27, 34, 0.8) !important;
    color: #f0f6fc !important;
    border: 1px solid rgba(48, 54, 61, 0.7) !important;
    border-radius: 8px;
    padding: 12px 16px;
    transition: all 0.3s ease;
    font-size: 0.95rem;
    backdrop-filter: blur(4px);
}

.swagger-ui input[type=text]:focus,
.swagger-ui input[type=password]:focus,
.swagger-ui input[type=email]:focus,
.swagger-ui textarea:focus,
.swagger-ui select:focus {
    border-color: #58a6ff !important;
    box-shadow: 
        0 0 0 3px rgba(88, 166, 255, 0.2) !important,
        0 4px 12px rgba(88, 166, 255, 0.1) !important;
    outline: none !important;
    background: rgba(22, 27, 34, 0.95) !important;
}

/* Enhanced filter input */
.swagger-ui .filter .operation-filter-input {
    background: rgba(22, 27, 34, 0.8) !important;
    color: #f0f6fc !important;
    border: 1px solid rgba(48, 54, 61, 0.7) !important;
    border-radius: 12px;
    padding: 16px 20px;
    font-size: 1rem;
    transition: all 0.3s ease;
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.swagger-ui .filter .operation-filter-input::placeholder {
    color: #6e7681 !important;
}

.swagger-ui .filter .operation-filter-input:focus {
    outline: none;
    border-color: #58a6ff !important;
    box-shadow: 
        0 0 0 3px rgba(88, 166, 255, 0.2) !important,
        0 8px 24px rgba(88, 166, 255, 0.1) !important;
    background: rgba(22, 27, 34, 0.95) !important;
}

/* Authorization styling */
.swagger-ui .auth-container {
    background: rgba(22, 27, 34, 0.8) !important;
    border: 1px solid rgba(48, 54, 61, 0.5) !important;
    border-radius: 16px;
    padding: 24px;
    margin: 24px 0;
    backdrop-filter: blur(8px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* Custom scrollbar styling */
.swagger-ui ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}

.swagger-ui ::-webkit-scrollbar-track {
    background: rgba(22, 27, 34, 0.5);
    border-radius: 6px;
}

.swagger-ui ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #484f58, #6e7681);
    border-radius: 6px;
    border: 2px solid transparent;
    background-clip: padding-box;
}

.swagger-ui ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #656c76, #8b949e);
}

.swagger-ui ::-webkit-scrollbar-corner {
    background: rgba(22, 27, 34, 0.5);
}

/* Enhanced tables */
.swagger-ui table {
    background: rgba(22, 27, 34, 0.6) !important;
    border: 1px solid rgba(48, 54, 61, 0.5) !important;
    border-radius: 12px;
    overflow: hidden;
    backdrop-filter: blur(4px);
}

.swagger-ui table th,
.swagger-ui table td {
    border: 1px solid rgba(48, 54, 61, 0.3) !important;
    color: #f0f6fc !important;
    padding: 12px !important;
}

.swagger-ui table thead tr th {
    background: rgba(33, 38, 45, 0.8) !important;
    color: #f0f6fc !important;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.85rem;
    letter-spacing: 0.05em;
}

/* Enhanced links */
.swagger-ui a {
    color: #58a6ff !important;
    transition: color 0.2s ease;
    text-decoration: none;
}

.swagger-ui a:hover {
    color: #79c0ff !important;
    text-decoration: underline;
}

/* Section headers */
.swagger-ui .opblock-tag {
    color: #f0f6fc !important;
    border-bottom: 2px solid rgba(48, 54, 61, 0.5) !important;
    font-size: 1.5rem !important;
    font-weight: 700 !important;
    padding: 20px 0 !important;
    margin-bottom: 24px !important;
    position: relative;
}

.swagger-ui .opblock-tag::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, #58a6ff, #79c0ff);
}

/* Loading states */
.swagger-ui .loading-container {
    background: rgba(22, 27, 34, 0.8) !important;
    border-radius: 12px;
    backdrop-filter: blur(8px);
}

/* Error states */
.swagger-ui .error-wrapper {
    background: rgba(248, 81, 73, 0.1) !important;
    border: 1px solid rgba(248, 81, 73, 0.3) !important;
    border-radius: 12px;
    backdrop-filter: blur(4px);
}

/* Success states */
.swagger-ui .success {
    background: rgba(73, 204, 144, 0.1) !important;
    border: 1px solid rgba(73, 204, 144, 0.3) !important;
    border-radius: 12px;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
    .swagger-ui .info .title {
        font-size: 2.2rem;
    }
    
    .swagger-ui .opblock {
        margin-bottom: 16px;
        border-radius: 12px;
    }
    
    .swagger-ui .info {
        margin: 16px 0 24px 0;
        padding: 20px;
        border-radius: 12px;
    }
    
    .swagger-ui .btn.execute {
        padding: 10px 16px;
        font-size: 0.75rem;
    }
}

@media (max-width: 480px) {
    .swagger-ui .info {
        padding: 16px;
    }
    
    .swagger-ui .info .title {
        font-size: 1.8rem;
    }
    
    .swagger-ui .opblock {
        border-radius: 8px;
    }
}`
