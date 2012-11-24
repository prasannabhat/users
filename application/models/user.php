<?php

class User extends Eloquent {

	public static $timestamps = true;

	public function validate()
	{
		$rules = array(
			'name'  => 'required|between:5,25',
			'phone' => 'required|match:"/^\d{10}\s*$/"',
			'email' => 'required|email',
		);
		$validation = Validator::make($this->to_array(), $rules);
		return $validation;
	}

}
