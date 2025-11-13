@extends('wpbox::website.layout')

<!-- <div class="container">
  <div class="row">
    <div class="col d-flex">
      <div class="flex-fill">Column 1</div>
    </div>
    <div class="col d-flex">
      <div class="flex-fill">Column 2</div>
    </div>
    <div class="col d-flex">
      <div class="flex-fill">Column 3</div>
    </div>
  </div>
</div> -->


@section('content')
    <main class="mb-5">
        <section>
            <div class="container py-4 py-xl-5">
                <div class="row mb-5">
                    <div class="col-md-8 col-xl-6 text-center mx-auto">
                        <h1 class="font-weight-bold" style="font-size:3rem;">Our Pricing Plan</h1>
                    </div>
                </div>
                <div>
                    <!-- <ul class="nav nav-pills d-flex justify-content-center" role="tablist">
                        <li class="nav-item" role="presentation"><a class="nav-link" role="tab" data-toggle="pill" href="#tab-1" style="color: #A7D26D;">Yearly</a></li>
                        <li class="nav-item" role="presentation"><a class="nav-link active" role="tab" data-toggle="pill" href="#tab-2" style="background: #A7D26D;">Monthly</a></li>
                    </ul> -->
                    <div class="tab-content pt-5">
                        <div class="tab-pane active" role="tabpanel" id="tab-1">
                            <div class="row row-cols-1 row-cols-md-2 row-cols-xl-3 d-xl-flex align-items-xl-center">
                                @foreach ($plans as $keyp => $plan)
                                <div class="col d-flex">
                                    <div class="flex-fill">
                                        @if ($keyp == 1)
                                            @include('wpbox::website.partials.featured-pricing-card', ['switch' => '0'])
                                        @else
                                            @include('wpbox::website.partials.pricing-card', ['switch' => '0'])
                                        @endif
                                    </div>
                                </div>
                                @endforeach
                            </div>
                            <div class="text-center pt-5">
                                <h1 class="font-weight-bolder" style="text-align: center;">Whatsapp API charges</h1>
                                <div class="text-center mx-auto">
                                    <a class="btn btn-white text-center py-3 font-weight-bolder" role="button" href="https://docs.google.com/spreadsheets/d/1DCqFVFpnkzegNONXQ1Z2sTJOyI4g77EPB616_WL3CaY/edit?usp=sharing" target=”_blank”  style="background: #A7D26D;border-radius: 1.3rem;font-size: 1.3rem;">Official meta pricing</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
@endsection