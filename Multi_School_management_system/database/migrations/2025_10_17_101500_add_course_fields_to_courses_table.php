<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->string('code', 50)->nullable()->after('course_name');
            $table->text('description')->nullable()->after('code');
            $table->string('duration', 50)->nullable()->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('courses', function (Blueprint $table) {
            $table->dropColumn(['code', 'description', 'duration']);
        });
    }
};
