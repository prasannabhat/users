<?php

class Users_Controller extends Base_Controller {

	public function action_index()
	{
		if (Request::ajax())
		{
			$users = User::order_by('name')->get();
		    return Response::eloquent($users);
		}
		else
		{
			return View::make('user.index');
		}
	}

	public function action_create()
	{
		$data = Input::json();
		
		$user = new User;
		$user->name = $data->name;
		$user->email = $data->email;
		$user->phone = $data->phone;
		$user->description = $data->description;

		$validation = $user->validate();

		$response = new stdClass;

		if($validation->fails())
		{
			return Response::json($validation->errors,406);
		}
		else
		{
			$user->save();
			return Response::eloquent($user);
		}
	}

	public function action_update($id)
	{
		$data = Input::json();
		
		$user = User::find($id);
		$user->name = $data->name;
		$user->email = $data->email;
		$user->phone = $data->phone;
		$user->description = $data->description;

		$validation = $user->validate();

		$response = new stdClass;

		if($validation->fails())
		{
			return Response::json($validation->errors,406);
		}
		else
		{
			$user->save();
			return Response::eloquent($user);
		}
	}

	public function action_destroy($id)
	{
		$user = User::find($id);
		$user->delete();
		return Response::eloquent($user);
	}
}
