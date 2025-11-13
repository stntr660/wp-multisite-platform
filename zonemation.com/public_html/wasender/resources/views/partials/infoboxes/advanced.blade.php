<style>
    .card-unique {
        background-color: #222823;
        border-radius: 15px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #d9e9b7;
        font-family: Arial, sans-serif;
        position: relative;
    }
    

    .icon-unique {
        width: 15% !important;
        margin-top: 10%;
        height: auto !important;
        filter: invert(84%) sepia(12%) saturate(1420%) hue-rotate(39deg) brightness(95%) contrast(86%) !important;
    }

    .title-unique {
        margin-top: 1%;
        font-size: 20px;
        color: white;
    }

    .number-unique {
        font-size: 30px;
        margin-top: -10px;
    }

    .subtext-unique {
        font-size: 14px;
        color: #9a9a9a;

        margin-bottom: 4%;
    }

</style>


<div class="row">

@foreach ($collection as $item)
    @if ($item['main_value'])
    <div class="col-xl-3 col-md-6 mt-4">

        <div class="card card-stats">
           @if (isset($item['href']))
               <a href="{{ $item['href'] }}">
           @endif

           <div class="card-unique">
                <img class="icon-unique" src="{{ asset('assets/img/'.str_replace(' ', '', $item['title']) . '.svg') }}" class="nav-icon" alt="Paying clients">
                <div class="title-unique">{{ __($item['title']) }}</div>
                <div class="number-unique">{{ $item['main_value'] }}</div>
                <div class="subtext-unique">{{ $item['sub_value'] }} {{ __($item['sub_title']) }}</div>
            </div>
            
            @if (isset($item['href']))
               </a>
           @endif
        </div>
    </div>
    @endif
    @endforeach
</div>