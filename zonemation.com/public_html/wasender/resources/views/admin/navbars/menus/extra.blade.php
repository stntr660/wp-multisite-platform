<style>



.card-header{
    background: #F6F9FC !important;
}



.card .badge-success {
  color: white !important;
}


.card{
    background-color: #212529 !important;
         
}
  
    .nav-icon {
        width: 20px !important;
        /* Adjust size as needed */
        height: auto !important;
        margin: 15px !important;
        /* Adjust spacing as needed */
        filter: invert(56%) sepia(1%) saturate(6952%) hue-rotate(26deg) brightness(109%) contrast(77%) !important;
    }

    #extra-menus{
        margin-left: 0%;
    }
    .collapse a{
        color: white !important;
    }
 
    
    .card .card-title{
        color: white !important;
    }

    .card .h2{
        color:  #A7D26D;
    }



    .table-flush{
        color: #95987C !important;
    }
    #Flows{
        display: none !important;
    }

    #Bots{
        display: none !important;
    }
    #API-info{
        display: none !important;
    }
    #API-campaigns{
        display: none !important;
    }
    #apps{
        display: none !important;
    }
</style>

<ul class="navbar-nav" id="extra-menus">
    <!-- Extra menus -->
    @foreach (auth()->user()->getExtraMenus() as $menu)
    @if (isset($menu['isGroup']) && $menu['isGroup'])
    <a class="nav-link" href="#navbar-{{ $menu['id'] }}" data-toggle="collapse" role="button" aria-expanded="false" aria-controls="navbar-{{ $menu['id'] }}">
        
        <img src="{{ asset('assets/img/'.$menu['name'].'.svg') }}" alt="{{ $menu['name'] }} icon" class="nav-icon" />
        <span class="nav-link-text">{{ __($menu['name']) }}</span>
    </a>
    <div class="collapse" id="navbar-{{ $menu['id'] }}">
        <ul class="nav nav-sm flex-column">
            @foreach ($menu['menus'] as $submenu)
            <li class="nav-item" id="{{ str_replace(' ', '-', $submenu['name']) }}">
                <a class="nav-link @if (Route::currentRouteName() == $submenu['route']) active @endif" href="{{ route($submenu['route'], isset($submenu['params']) ? $submenu['params'] : []) }}">
                    
                    <img src="{{ asset('assets/img/'.str_replace(' ', '', $submenu['name']) .'.svg') }}" alt="{{ $submenu['name'] }} icon" class="nav-icon" />
                    {{ __($submenu['name']) }}
                </a>
            </li>
            @endforeach
        </ul>
    </div>
    @else
    <li class="nav-item" id="{{ str_replace(' ', '-', $menu['name']) }}">
        <a class="nav-link @if (Route::currentRouteName() == $menu['route']) active @endif" href="{{ route($menu['route'], isset($menu['params']) ? $menu['params'] : []) }}">
            
            <img src="{{ asset('assets/img/'.$menu['name'].'.svg') }}" alt="{{ $menu['name'] }} icon" class="nav-icon" />
            {{ __($menu['name']) }}
        </a>
    </li>
    @endif
    @endforeach
</ul>
