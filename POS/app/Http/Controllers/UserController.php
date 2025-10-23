<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = User:: paginate();

         return Inertia::render('users/index',['users' => $user]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
  
public function store(Request $request)
{
    try {
        $user = User::create([
            'name' => $request->fullname,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'is_admin' => $request->role == '1' ? 1 : 2, // 1 = Admin, 2 = Cashier
            'phone_number' => $request->phoneNumber, 
        ]);

        return response()->json([
            'message' => 'User created successfully!',
            'user' => $user
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Failed to create user',
            'error' => $e->getMessage()
        ], 500);
    }
}


    /**
     * Display the specified resource.
     */
    public function show(User $suppliers)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $suppliers)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
   public function update(Request $request, $id)
{
    $user = User::find($id);

    // If user does not exist
    if (!$user) {
        return response()->json([
            'message' => 'User not found'
        ], 404);
    }

   /*  // Validate request
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email,' . $id,
        'phone_number' => 'required|string|min:10',
        'is_admin' => 'required|integer',
    ]);
 */
    // Update
    $user->update($request->all());

    return back()->with('success', 'User updated successfully.');
}


    /**
     * Remove the specified resource from storage.
     */
    public function destroy( $id)
    {
        $user = User::find($id);

        if(!$user){
            return back()->with("Error","User not found");
        }

        $user->delete();
        return back()->with("Success","User deleted successfully");

    }
}
