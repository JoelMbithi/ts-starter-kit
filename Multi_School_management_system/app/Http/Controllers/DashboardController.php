<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Course;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
    {
        $tenantId = Auth::user()->tenant_id;

        // Fetch data
        $students = Student::where('tenant_id', $tenantId)->get(['student_id', 'first_name', 'last_name', 'class', 'age']);
        $teachers = Teacher::where('tenant_id', $tenantId)->get(['teacher_id', 'first_name', 'last_name']);
        $courses = Course::where('tenant_id', $tenantId)->get(['course_id', 'name']);

        // Pass data to Inertia
        return Inertia::render('Dashboard', [
            'students' => $students,
            'teachers' => $teachers,
            'courses' => $courses,
            'totalStudents' => $students->count(),
            'totalTeachers' => $teachers->count(),
            'totalCourses' => $courses->count(),
        ]);
    }
}
