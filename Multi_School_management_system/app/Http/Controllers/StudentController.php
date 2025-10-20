<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Enrollment;
use App\Models\Course;
use App\Models\Teacher;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index()
    {
        $tenantId = Auth::user()->tenant_id;
        $students = Student::where('tenant_id', $tenantId)->get();
        $teachers = Teacher::where('tenant_id', $tenantId)->get();
        $courses = Course::where('tenant_id', $tenantId)->get();

        return Inertia::render('Students/page', [
            'students' => $students,
            'teachers' => $teachers,
            'courses' => $courses,
            'totalStudents' => $students->count(),
        ]);
    }

    
    public function store(Request $request)
    {
        $tenantId = Auth::user()->tenant_id;

        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'grade' => 'required|string|max:10',
            'class' => 'required|string|max:10',
            'age' => 'required|integer|min:3',
            'registration_number' => 'required|string|unique:students,registration_number',
            'course_id' => 'required|exists:courses,course_id',
            'teacher_id' => 'required|exists:teachers,teacher_id',
        ]);

        //  Create student
        $student = Student::create([
            'tenant_id' => $tenantId,
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'grade' => $validated['grade'],
            'class' => $validated['class'],
            'age' => $validated['age'],
            'registration_number' => $validated['registration_number'],
        ]);

        //  Auto-create enrollment (renamed 'class' → 'class_name')
        Enrollment::create([
            'tenant_id' => $tenantId,
            'student_id' => $student->student_id,
            'course_id' => $validated['course_id'],
            'teacher_id' => $validated['teacher_id'],
            'class_name' => $validated['class'], //  Fixed here
            'enrollment_date' => now(),
            'status' => 'Active',
        ]);

        return Redirect::route('students.index')
            ->with('success', 'Student and enrollment added successfully!');
    }

    public function edit(Student $student)
    {
        return Inertia::render('Students/Edit', [
            'student' => $student,
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'grade' => 'required|string|max:10',
            'class' => 'required|string|max:10',
            'age' => 'required|integer|min:3',
            'registration_number' => 'required|string|unique:students,registration_number,' . $student->student_id . ',student_id',
        ]);

        $student->update($validated);

        return response()->json([
            'message' => 'Student updated successfully!',
            'student' => $student,
        ]);
    }

    public function destroy(Student $student)
    {
        $student->delete();
        return Redirect::route('students.index')
            ->with('success', 'Student successfully deleted');
    }

    public function search(Request $request)
    {
        $tenantId = Auth::user()->tenant_id;
        $query = $request->input('query');

        $students = Student::where('tenant_id', $tenantId)
            ->where(function ($q) use ($query) {
                $q->where('first_name', 'ILIKE', "%{$query}%")
                  ->orWhere('last_name', 'ILIKE', "%{$query}%")
                  ->orWhere('registration_number', 'ILIKE', "%{$query}%")
                  ->orWhere('grade', 'ILIKE', "%{$query}%")
                  ->orWhere('class', 'ILIKE', "%{$query}%");
            })
            ->get();

        return response()->json($students);
    }
}
