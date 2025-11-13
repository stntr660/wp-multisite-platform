@extends('general.index', $setup)

@section('thead')
    <th>{{ __('Name') }}</th>
    <th>{{ __('Description') }}</th>
    <th>{{ __('Active') }}</th>
    <th>{{ __('crud.actions') }}</th>
@endsection
@section('tbody')
    @foreach ($setup['items'] as $item)
            <tr>
            <td>{{ $item->name }}</td>
            <td>{{ $item->description }}</td>
            <td>{{ $item->active ? 'Yes' : 'No' }}</td>
            <td>
                <!-- EDIT -->
                <a href="{{ route('chatbots.edit',['chat'=>$item->id]) }}" class="btn btn-primary btn-sm">
                    <i class="ni ni-ruler-pencil"></i>
                </a>

                <!-- EDIT -->
                <a href="{{ route('chatbots.delete',['chat'=>$item->id]) }}" class="btn btn-danger btn-sm">
                    <i class="ni ni ni-fat-remove"></i>
                </a>
            </td>
        </tr> 
    @endforeach
@endsection