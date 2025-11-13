<style>
    .nav-icon {
        width: 20px !important; /* Adjust size as needed */
        height: auto  !important;
        margin: 15px  !important; /* Adjust spacing as needed */
    }
</style>

@php
    function getSvgIconPath($name) {
        $formattedName = str_replace(' ', '', $name); // Remove spaces
        return asset("assets/img/{$formattedName}.svg");
    }
@endphp

<ul class="navbar-nav">
    <!-- Extra menus -->
    @foreach (auth()->user()->getExtraMenus() as $menu)
        <li class="nav-item">
            <a class="nav-link" href="{{ route($menu['route'], isset($menu['params']) ? $menu['params'] : []) }}">
                @php
                    $svgPath = getSvgIconPath($menu['name']);
                @endphp
                <img src="{{ $svgPath }}" alt="{{ $menu['name'] }} icon" class="nav-icon" /> {{ __($menu['name']) }}
            </a>
        </li>
    @endforeach
</ul>

