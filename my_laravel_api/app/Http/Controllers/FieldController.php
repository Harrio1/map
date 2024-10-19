<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FieldController extends Controller
{
    public function index()
    {
        // Возвращаем данные (например, из базы данных)
        return response()->json(['data' => 'Hello from Laravel API']);
    }

    public function store(Request $request)
    {
        // Обработка данных, полученных от клиента
        return response()->json(['message' => 'Data saved successfully']);
    }
}
