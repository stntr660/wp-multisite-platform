
    <div class="card card h-100 text-white" style="border-radius: 2rem;background: radial-gradient(#333131, black);">
        <div class="card-body flex-grow-0 p-4 h-100">
            <h1 class="font-weight-bolder" style="font-size: 3rem;color: #A7D26D;">
                {{ is_array($plan) ? $plan['name'] : $plan->name }}
            </h1>
            <span class="badge badge-primary text-uppercase mb-2 text-dark" style="background: #A7D26D;">Standard</span>
            <h4 class="display-4 font-weight-bold card-title text-center" style="font-size: 2rem;">
                {{ config('money')[strtoupper(config('settings.cashier_currency'))]['symbol'] }}
                {{ is_array($plan) ? $plan['price'] : $plan->price }}
                <span class="font-weight-normal" style="font-size: 2rem;">/mo</span>
                {{-- <span class="d-block small text-center my-3" style="font-size: 1rem;">
                    Annual
                    <span class="* px-3 py-1 ml-3 text-dark" style="border-radius: .9rem;background-color: #e1e1e1;">15%
                        off</span>
                </span> --}}
                @if ($switch == '1')
                    <a class="btn btn-white my-3  d-block w-100 py-3 font-weight-bolder border-0 disabled" role="button" href="{{ route('plans.current') }}"
                        style="background: #A7D26D;border-radius: 1.3rem;font-size: 1.3rem;">Current plan</a>
                @else
                    <a class="btn btn-white my-3  d-block w-100 py-3 font-weight-bolder border-0" role="button" href="{{ route('plans.current') }}"
                        style="background: #A7D26D;border-radius: 1.3rem;font-size: 1.3rem;">Choose plan</a>
                @endif
            </h4>
            <div>
                <ul class="list-unstyled">
                    @if ($plan['features'] != null)
                        @foreach (explode(',', $plan['features']) as $feature)
                            <li class="d-flex mb-2"><span
                                    class="bs-icon-xs bs-icon-rounded bs-icon-primary-light bs-icon bs-icon-xs mr-2"
                                    style="background-color: #A7D26D;"><svg xmlns="http://www.w3.org/2000/svg"
                                        width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16"
                                        class="bi bi-check-lg text-white">
                                        <path
                                            d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022">
                                        </path>
                                    </svg></span><span class="font-weight-bolder"
                                    style="color:white;">{{ $feature }}</span></li>
                        @endforeach
                    @endif
                </ul>
            </div>
        </div>
    </div>

