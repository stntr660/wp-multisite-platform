@extends('general.index', $setup)

@section('thead')
    <th>{{ __('Name') }}</th>
    <th>{{ __('Trriggered') }}</th>
    <th>{{ __('Steps Finished') }}</th>
    <th>{{ __('Finished') }}</th>
    <th>{{ __('Active') }}</th>
@endsection
@section('tbody')
    @foreach ($setup['items'] as $item)
            <tr>
            <td>{{ $item->name }}</td>
            <td>{{ $item->triggered }}</td>
            <td>{{ $item->steps_finished }}</td>
            <td>{{ $item->finished}}</td>
            <td>{{ $item->active}}</td>
            <td>
                <!-- EDIT -->
                <a href="{{ route('flowbots.edit',['flow' => $item->id]) }}" class="btn btn-primary btn-sm">
                    <i class="ni ni-ruler-pencil"></i>
                </a>

                <!-- EDIT -->
                <a href="{{ route('flowbots.delete',['flow'=>$item->id]) }}" class="btn btn-danger btn-sm">
                    <i class="ni ni ni-fat-remove"></i>
                </a>
            </td>
        </tr> 
    @endforeach
@endsection