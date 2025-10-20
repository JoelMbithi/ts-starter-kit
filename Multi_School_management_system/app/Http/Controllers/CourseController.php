<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseController extends Controller
{
    public function index()
{
    $courses = Course::withCount('enrollments')
        ->with(['enrollments.student:student_id,first_name,last_name']) //  use actual PK and columns
        ->get();

    return Inertia::render('Courses/page', [
        'courses' => $courses,
        'totalCourses' => $courses->count(),
        'totalEnrollments' => $courses->sum('enrollments_count'),
    ]);
}


    public function create()
    {
        return Inertia::render('Courses/Create');
    }

   public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'code' => 'required|string|max:50|unique:courses,code',
        'description' => 'nullable|string',
        'teacher' => 'required|string|max:255', // send teacher instead of name
        'duration' => 'nullable|string|max:100',
    ]);

    Course::create([
        'tenant_id' => 1, // adjust as needed
        'teacher' => $validated['teacher'],
        'course_name' => $validated['name'],
        'code' => $validated['code'],
        'description' => $validated['description'] ?? null,
        'duration' => $validated['duration'] ?? null,
    ]);

    return redirect()->route('courses.index')->with('success', 'Course created successfully.');
}


    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        $course->delete();

        return redirect()->back()->with('success', 'Course deleted successfully.');
    }


    public function search(Request $request)
{
    $query = $request->get('query', '');
    $results = Course::where('course_name', 'like', "%{$query}%")
        ->orWhere('code', 'like', "%{$query}%")
        ->orWhere('teacher', 'like', "%{$query}%")
        ->get();

    return response()->json($results);
}

}
