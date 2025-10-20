<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enrollments', function (Blueprint $table) {
            $table->increments('enrollment_id'); // Primary key

            // Foreign key fields
            $table->unsignedInteger('tenant_id');
            $table->unsignedInteger('student_id');
            $table->unsignedInteger('course_id');
            $table->unsignedInteger('teacher_id')->nullable();


            // Date field with PostgreSQL-compatible default
            $table->date('enroll_date')->default(DB::raw('CURRENT_DATE'));

            $table->timestamps();

            // Foreign key constraints (optional but recommended)
            $table->foreign('tenant_id')->references('tenant_id')->on('tenants')->onDelete('cascade');
            $table->foreign('student_id')->references('student_id')->on('students')->onDelete('cascade');
            $table->foreign('course_id')->references('course_id')->on('courses')->onDelete('cascade');
            $table->foreign('teacher_id')->references('teacher_id')->on('teachers')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('enrollments');
    }
};
