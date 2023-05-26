<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SessionController;
use Illuminate\Support\Facades\Route;

Route::get('/', [ProductController::class, 'index'])->name('index');
Route::get('/log/{message}', [SessionController::class, 'login'])->name('gologin');
Route::get('/product/{id}', [ProductController::class, 'product']);
Route::get('/profile', [ProfileController::class, 'create'])->name('profile.create');
Route::get('/profile/checkemail/{email}', [ProfileController::class, 'checkemail']);
Route::post('/profile/store', [ProfileController::class, 'store'])->name('profile.store');

Route::middleware('auth')->group(function () {
   Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
   // Route::resource('/profile', ProfileController::class);
});

require __DIR__.'/auth.php';
