<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('enrollments', function (Blueprint $table) {
            if (!Schema::hasColumn('enrollments', 'teacher_id')) {
                $table->unsignedBigInteger('teacher_id')->nullable();
            }

            if (!Schema::hasColumn('enrollments', 'class')) {
                $table->string('class', 20)->nullable();
            }

            if (!Schema::hasColumn('enrollments', 'enrollment_date')) {
                $table->timestamp('enrollment_date')->nullable();
            }

            if (!Schema::hasColumn('enrollments', 'status')) {
                $table->string('status', 50)->default('Active');
            }
        });
    }

    public function down(): void
    {
        Schema::table('enrollments', function (Blueprint $table) {
            $table->dropColumn(['teacher_id', 'class', 'enrollment_date', 'status']);
        });
    }
};
