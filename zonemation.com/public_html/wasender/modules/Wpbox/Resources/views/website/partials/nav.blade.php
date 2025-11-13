<nav class="navbar navbar-light navbar-expand-xl py-3 fixed-top bg-apple">
    <div class="container-fluid">
        <a class="navbar-brand d-flex align-items-center m-1" href="{{ route('homepage') }}">
            <img class="w-75" src="assets/img/Fichier%2087.png"></a>
        <button data-toggle="collapse" class="navbar-toggler" data-target="#navcol-3">
            <span class="sr-only">Toggle navigation</span>
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse d-xl-flex justify-content-xl-center align-items-xl-center navbar-dark"
            id="navcol-3" style="border-radius: 17px;">
            <ul class="navbar-nav mx-auto navbar-dark px-3 m-1"
                style="background: #181A0F;border-radius: 0.8rem;padding: 6px;padding-top: 10px;padding-bottom: 10px;margin-left: -2rem;">
                <li class="nav-item">
                    <a class="nav-link {{ (request()->is('/')) ? 'active' : '' }} px-4" href="{{ route('homepage') }}"
                        style="font-size: .8rem;">
                        HOME
                    </a>
                </li>
                <li class="nav-item">
                    <div class="px-4 dropdown">
                        <button class="btn btn-secondary dropdown-toggle border-0 nav-link"
                            style="background-color:#181A0F;font-size: .8rem;" type="button" id="dropdownMenuButton"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            SERVICES
                        </button>
                        <div class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton"
                            style="background-color:#181A0F;font-size: .8rem;">
                            <a class="d-block w-100 p-2 fw-bolder bg-black border-0 text-center text-white"
                                href="{{ route('wpMarketing') }}">WP MARKETING</a>
                            <a class="d-block w-100 p-2 fw-bolder bg-black border-0 text-center text-white" href="{{ route('chatBot') }}">CHATBOT</a>
                            <a class="d-block w-100 p-2 fw-bolder bg-black border-0 text-center text-white" 
                                href="{{ route('multiUser') }}">MULTIUSER</a>
                        </div>
                    </div>
                </li>
                <li class="nav-item">
                    <div class="px-4 dropdown">
                        <button class="btn btn-secondary dropdown-toggle border-0 nav-link"
                            style="background-color:#181A0F;font-size: .8rem;" type="button" id="dropdownMenuButton"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            INDUSTRIES
                        </button>
                        <div class="dropdown-menu dropdown-menu-dark" style="background-color:#181A0F;font-size: .8rem;"
                            aria-labelledby="dropdownMenuButton">
                            <a class="d-block w-100 p-2 fw-bolder bg-black border-0 text-center text-white"
                                href="{{ route('ecommerce') }}">ECOMMERCE</a>
                            <a class="d-block w-100 p-2 fw-bolder bg-black border-0 text-center text-white"
                                href="{{ route('education') }}">EDUCATION</a>
                            <!-- <a class="dropdown-item text-white" href="{{ route('pme') }}">PME</a>
                          <a class="dropdown-item text-white" href="{{ route('realEstate') }}">REAL ESTATE</a> -->
                        </div>
                    </div>
                </li>
                <li class="nav-item">
                    <a class="nav-link {{ (request()->is('pricing')) ? 'active' : '' }} px-4"
                        href="{{ route('pricing') }}" style="font-size: .8rem;">
                        PRICING
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link {{ (request()->is('contactUs')) ? 'active' : '' }} px-4"
                        href="{{ route('contactUs') }}" style="font-size: .8rem;">
                        CONTACT US
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link p-2 text-dark {{ (request()->is('book')) ? 'active' : '' }}"
                        href="{{ route('book') }}" style="background: #A7D26D; border-radius: .5rem; font-size: .8rem;">
                        GET FREE TRIAL
                    </a>
                </li>
            </ul>
            <div class="text-center m-1">
                @if (auth()->check())
                <a class="btn btn-primary p-2" role="button" href="{{ route('dashboard') }}"
                    style="background: #A7D26D;color: #181A0F;border-radius: .5rem;border-width: 0px;font-size: .8rem;">DASHBOARD</a>
            @else
                <a class="btn btn-primary p-2" role="button" href="{{ route('home') }}"
                    style="background: #A7D26D;color: #181A0F;border-radius: .5rem;border-width: 0px;font-size: .8rem;">SIGN
                    IN</a>
            @endif
            </div>
            
        </div>
    </div>
</nav>