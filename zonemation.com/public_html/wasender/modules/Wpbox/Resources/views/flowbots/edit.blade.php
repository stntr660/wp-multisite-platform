@extends('general.index', $setup)


@section('content')
<div class="appflow" style="width: 100vw; height: 100vh;">
    <div class="reactflow-wrapper" ref="reactFlowWrapper">
        <div class="topbar">
            @include('components.builder.notification')
        </div>
        <div class="reactflow">
            <react-flow
                :nodes="nodes"
                :edges="edges"
                @nodes-change="onNodesChange"
                @edges-change="onEdgesChange"
                @connect="onConnect"
                @init="setReactFlowInstance"
                @drop="onDrop"
                @dragover="onDragOver"
                :fit-view="true"
                :pro-options="proOptions"
                @node-click="update"
                :node-types="nodeTypes"
            >
                <controls></controls>
            </react-flow>
        </div>
        @if ($nodeSelected)
        <div class="rightbar">
            <topbar @save-flow="saveFlow"></topbar>
            <update-node
                :selected-node="changeNode"
                @set-node-selected="setNodeSelected"
                @set-nodes="setNodes"
            ></update-node>
        </div>
        @else
        <div class="rightbar">
            <topbar @save-flow="saveFlow"></topbar>
            <sidebar></sidebar>
        </div>
        @endif
    </div>
</div>
@endsection
