# Snake Game Backend Setup Documentation

## Overview
This document provides comprehensive instructions for setting up a Laravel backend for the Snake Game mobile application. The backend will handle user authentication, score management, and leaderboards.

## Prerequisites
- PHP 8.1 or higher
- Composer
- MySQL 8.0 or higher
- Laravel 10.x
- Node.js (for frontend API integration)

## Backend Features
- User registration and authentication
- JWT token-based authentication
- Personal score tracking
- Global leaderboards
- User profiles
- Password reset functionality
- API rate limiting
- Input validation and sanitization

## Installation Steps

### 1. Create New Laravel Project
```bash
composer create-project laravel/laravel snake-game-backend
cd snake-game-backend
```

### 2. Install Required Packages
```bash
# JWT Authentication
composer require tymon/jwt-auth

# API Resources
composer require spatie/laravel-query-builder

# CORS support
composer require fruitcake/laravel-cors

# Rate limiting
composer require spatie/laravel-rate-limited-job-middleware
```

### 3. Environment Configuration
Create `.env` file:
```env
APP_NAME=SnakeGameAPI
APP_ENV=production
APP_KEY=base64:your-generated-key
APP_DEBUG=false
APP_URL=https://your-domain.com

LOG_CHANNEL=stack
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=snake_game
DB_USERNAME=your_username
DB_PASSWORD=your_password

JWT_SECRET=your-jwt-secret-key
JWT_TTL=1440

MAIL_MAILER=smtp
MAIL_HOST=mailpit
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS="noreply@snakegame.com"
MAIL_FROM_NAME="${APP_NAME}"
```

### 4. Database Setup

#### Create Database
```sql
CREATE DATABASE snake_game CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

#### Run Migrations
```bash
php artisan migrate
```

### 5. JWT Configuration
```bash
php artisan jwt:secret
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
```

## Database Schema

### Users Table
```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('username')->unique();
    $table->string('email')->unique();
    $table->timestamp('email_verified_at')->nullable();
    $table->string('password');
    $table->string('first_name');
    $table->string('last_name');
    $table->string('avatar')->nullable();
    $table->integer('total_games')->default(0);
    $table->integer('best_score')->default(0);
    $table->integer('total_score')->default(0);
    $table->rememberToken();
    $table->timestamps();
});
```

### Scores Table
```php
Schema::create('scores', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->integer('score');
    $table->integer('level');
    $table->integer('game_duration'); // in seconds
    $table->string('difficulty')->default('normal');
    $table->json('game_stats')->nullable(); // food eaten, power-ups used, etc.
    $table->timestamps();
    
    $table->index(['user_id', 'score']);
    $table->index(['score', 'created_at']);
});
```

### Leaderboards Table (for daily/weekly/monthly)
```php
Schema::create('leaderboards', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->integer('score');
    $table->string('period_type'); // daily, weekly, monthly, all_time
    $table->date('period_date');
    $table->integer('rank');
    $table->timestamps();
    
    $table->unique(['user_id', 'period_type', 'period_date']);
    $table->index(['period_type', 'period_date', 'rank']);
});
```

## API Endpoints

### Authentication Routes
```
POST /api/auth/register     - User registration
POST /api/auth/login        - User login
POST /api/auth/logout       - User logout
POST /api/auth/refresh      - Refresh JWT token
POST /api/auth/forgot       - Password reset request
POST /api/auth/reset        - Password reset confirmation
```

### User Routes
```
GET  /api/user              - Get authenticated user profile
PUT  /api/user              - Update user profile
GET  /api/user/stats        - Get user statistics
POST /api/user/avatar       - Upload user avatar
```

### Score Routes
```
POST /api/scores            - Submit new score
GET  /api/scores            - Get user's score history
GET  /api/scores/best       - Get user's best scores
DELETE /api/scores/{id}     - Delete specific score
```

### Leaderboard Routes
```
GET  /api/leaderboard/global     - Global all-time leaderboard
GET  /api/leaderboard/daily      - Daily leaderboard
GET  /api/leaderboard/weekly     - Weekly leaderboard
GET  /api/leaderboard/monthly    - Monthly leaderboard
GET  /api/leaderboard/friends    - Friends leaderboard
```

## Model Implementations

### User Model (`app/Models/User.php`)
```php
<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'username', 'email', 'password', 'first_name', 'last_name',
        'total_games', 'best_score', 'total_score'
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }

    public function scores()
    {
        return $this->hasMany(Score::class);
    }

    public function leaderboardEntries()
    {
        return $this->hasMany(Leaderboard::class);
    }
}
```

### Score Model (`app/Models/Score.php`)
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Score extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'score', 'level', 'game_duration', 
        'difficulty', 'game_stats'
    ];

    protected $casts = [
        'game_stats' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

## Controller Examples

### AuthController (`app/Http/Controllers/AuthController.php`)
```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
        ]);

        $token = JWTAuth::fromUser($user);

        return response()->json([
            'message' => 'User successfully registered',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        if (!$token = JWTAuth::attempt($request->only('email', 'password'))) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        return $this->respondWithToken($token);
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60
        ]);
    }
}
```

### ScoreController (`app/Http/Controllers/ScoreController.php`)
```php
<?php

namespace App\Http\Controllers;

use App\Models\Score;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ScoreController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'score' => 'required|integer|min:0',
            'level' => 'required|integer|min:1',
            'game_duration' => 'required|integer|min:0',
            'difficulty' => 'required|string|in:easy,normal,hard',
            'game_stats' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = auth()->user();
        
        $score = Score::create([
            'user_id' => $user->id,
            'score' => $request->score,
            'level' => $request->level,
            'game_duration' => $request->game_duration,
            'difficulty' => $request->difficulty,
            'game_stats' => $request->game_stats,
        ]);

        // Update user statistics
        $user->increment('total_games');
        $user->increment('total_score', $request->score);
        
        if ($request->score > $user->best_score) {
            $user->update(['best_score' => $request->score]);
        }

        return response()->json([
            'message' => 'Score successfully recorded',
            'score' => $score,
        ], 201);
    }

    public function index()
    {
        $scores = auth()->user()
            ->scores()
            ->orderBy('score', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json($scores);
    }
}
```

### LeaderboardController (`app/Http/Controllers/LeaderboardController.php`)
```php
<?php

namespace App\Http\Controllers;

use App\Models\Score;
use App\Models\User;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    public function global()
    {
        $leaderboard = User::select('id', 'username', 'best_score', 'total_games')
            ->where('best_score', '>', 0)
            ->orderBy('best_score', 'desc')
            ->take(100)
            ->get()
            ->map(function ($user, $index) {
                $user->rank = $index + 1;
                return $user;
            });

        return response()->json($leaderboard);
    }

    public function daily()
    {
        $today = now()->toDateString();
        
        $leaderboard = Score::with('user:id,username')
            ->whereDate('created_at', $today)
            ->selectRaw('user_id, MAX(score) as best_score')
            ->groupBy('user_id')
            ->orderBy('best_score', 'desc')
            ->take(50)
            ->get()
            ->map(function ($score, $index) {
                return [
                    'rank' => $index + 1,
                    'username' => $score->user->username,
                    'score' => $score->best_score,
                ];
            });

        return response()->json($leaderboard);
    }
}
```

## API Routes (`routes/api.php`)
```php
<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ScoreController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Authentication routes
Route::group(['prefix' => 'auth'], function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::post('refresh', [AuthController::class, 'refresh'])->middleware('auth:api');
});

// Protected routes
Route::group(['middleware' => 'auth:api'], function () {
    // User routes
    Route::get('user', [UserController::class, 'profile']);
    Route::put('user', [UserController::class, 'updateProfile']);
    Route::get('user/stats', [UserController::class, 'stats']);
    
    // Score routes
    Route::resource('scores', ScoreController::class)->only(['index', 'store', 'destroy']);
    Route::get('scores/best', [ScoreController::class, 'best']);
});

// Public leaderboard routes (with rate limiting)
Route::group(['prefix' => 'leaderboard', 'middleware' => 'throttle:60,1'], function () {
    Route::get('global', [LeaderboardController::class, 'global']);
    Route::get('daily', [LeaderboardController::class, 'daily']);
    Route::get('weekly', [LeaderboardController::class, 'weekly']);
    Route::get('monthly', [LeaderboardController::class, 'monthly']);
});
```

## Middleware Configuration

### JWT Auth Guard (`config/auth.php`)
```php
'guards' => [
    'web' => [
        'driver' => 'session',
        'provider' => 'users',
    ],

    'api' => [
        'driver' => 'jwt',
        'provider' => 'users',
    ],
],
```

### CORS Configuration (`config/cors.php`)
```php
return [
    'paths' => ['api/*'],
    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'], // Configure specific origins in production
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
```

## Deployment Instructions

### 1. Server Requirements
- PHP 8.1+ with required extensions
- MySQL 8.0+
- Nginx or Apache
- SSL certificate (Let's Encrypt recommended)

### 2. Production Environment Setup
```bash
# Clone repository
git clone https://github.com/yourusername/snake-game-backend.git
cd snake-game-backend

# Install dependencies
composer install --no-dev --optimize-autoloader

# Set permissions
chmod -R 755 storage
chmod -R 755 bootstrap/cache

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate --force

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 3. Web Server Configuration (Nginx)
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/snake-game-backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

## Frontend Integration

### API Service (`services/api.js`)
```javascript
const API_BASE_URL = 'https://your-api-domain.com/api';

class ApiService {
  constructor() {
    this.token = null;
  }

  setToken(token) {
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  }

  // Authentication methods
  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Score methods
  async submitScore(scoreData) {
    return this.request('/scores', {
      method: 'POST',
      body: JSON.stringify(scoreData),
    });
  }

  async getLeaderboard(type = 'global') {
    return this.request(`/leaderboard/${type}`);
  }
}

export default new ApiService();
```

## Security Considerations
1. Use HTTPS in production
2. Implement proper input validation
3. Use rate limiting on all endpoints
4. Sanitize user inputs
5. Keep JWT secrets secure
6. Implement proper CORS policies
7. Use prepared statements for database queries
8. Regular security updates

## Testing
```bash
# Run tests
php artisan test

# Generate test coverage
php artisan test --coverage
```

## Monitoring and Logging
- Set up application monitoring (New Relic, DataDog)
- Configure log rotation
- Monitor API response times
- Set up error tracking (Sentry)

## Backup Strategy
- Daily database backups
- Weekly full application backups
- Off-site backup storage
- Automated backup verification

This comprehensive setup will provide a robust backend for your Snake Game with all the features needed for user management, scoring, and leaderboards.
