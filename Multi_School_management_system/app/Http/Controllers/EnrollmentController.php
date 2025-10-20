<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Enrollment;
use App\Models\Student;
use App\Models\Course;
use App\Models\Teacher;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class EnrollmentController extends Controller
{
    /**
     * 1. Display all enrollments
     */
    public function index()
    {
        $tenantId = Auth::user()->tenant_id;

        $enrollments = Enrollment::where('tenant_id', $tenantId)
            ->with(['student', 'course', 'teacher'])
            ->get()
            ->map(function ($enrollment) {
                return [
                    'enrollment_id'   => $enrollment->enrollment_id,
                    'student_name'    => optional($enrollment->student)->first_name . ' ' . optional($enrollment->student)->last_name,
                    'course_name'     => optional($enrollment->course)->course_name,
                    'class_name'      => optional($enrollment->student)->class ?? 'N/A',
                    'teacher_name'    => optional($enrollment->teacher)->first_name . ' ' . optional($enrollment->teacher)->last_name ?? 'N/A',
                    // format to YYYY-MM-DD
                    'enrollment_date' => $enrollment->enrollment_date ? date('Y-m-d', strtotime($enrollment->enrollment_date)) : 'N/A',
                    'status'          => ucfirst($enrollment->status ?? 'Active'),
                ];
            });

        //  Total count of enrollments
        $totalEnrollments = $enrollments->count();

        return Inertia::render('Enrollments/page', [
            'enrollments' => $enrollments,
            'totalEnrollments' => $totalEnrollments,
        ]);
    }

    /**
     * 2. Show enrollment creation form
     */
    public function create()
    {
        $tenantId = Auth::user()->tenant_id;

        return Inertia::render('Enrollments/Create', [
            'students' => Student::where('tenant_id', $tenantId)->get(['student_id', 'first_name', 'last_name']),
            'courses' => Course::where('tenant_id', $tenantId)->get(['course_id', 'course_name']),
            'teachers' => Teacher::where('tenant_id', $tenantId)->get(['teacher_id', 'first_name', 'last_name']),
        ]);
    }

    /**
     * 3. Store a new enrollment
     */
    public function store(Request $request)
    {
        $tenantId = Auth::user()->tenant_id;

        $validated = $request->validate([
            'student_id'       => 'required|exists:students,student_id',
            'course_id'        => 'required|exists:courses,course_id',
            'teacher_id'       => 'required|exists:teachers,teacher_id',
            'class'            => 'required|string|max:10',
            'enrollment_date'  => 'nullable|date',
            'status'           => 'nullable|string|max:50',
        ]);

        Enrollment::create([
            'tenant_id'        => $tenantId,
            'student_id'       => $validated['student_id'],
            'course_id'        => $validated['course_id'],
            'teacher_id'       => $validated['teacher_id'],
            'class'            => $validated['class'],
            'enrollment_date'  => $validated['enrollment_date'] ?? now()->format('Y-m-d'),
            'status'           => $validated['status'] ?? 'Active',
        ]);

        return Redirect::route('enrollments.index')
            ->with('success', 'Enrollment created successfully!');
    }

    /**
     * 4. Edit enrollment
     */
    public function edit(Enrollment $enrollment)
    {
        $tenantId = Auth::user()->tenant_id;

        return Inertia::render('Enrollments/Edit', [
            'enrollment' => $enrollment,
            'students'   => Student::where('tenant_id', $tenantId)->get(['student_id', 'first_name', 'last_name']),
            'courses'    => Course::where('tenant_id', $tenantId)->get(['course_id', 'course_name']),
            'teachers'   => Teacher::where('tenant_id', $tenantId)->get(['teacher_id', 'first_name', 'last_name']),
        ]);
    }

    /**
     * 5. Update enrollment
     */
    public function update(Request $request, Enrollment $enrollment)
    {
        $validated = $request->validate([
            'student_id'       => 'required|exists:students,student_id',
            'course_id'        => 'required|exists:courses,course_id',
            'teacher_id'       => 'required|exists:teachers,teacher_id',
            'class'            => 'required|string|max:10',
            'enrollment_date'  => 'nullable|date',
            'status'           => 'nullable|string|max:50',
        ]);

        $enrollment->update($validated);

        return Redirect::route('enrollments.index')
            ->with('success', 'Enrollment updated successfully!');
    }

    /**
     * 6. Delete enrollment
     */
    public function destroy(Enrollment $enrollment)
    {
        $enrollment->delete();

        return Redirect::route('enrollments.index')
            ->with('success', 'Enrollment deleted successfully!');
    }
}
