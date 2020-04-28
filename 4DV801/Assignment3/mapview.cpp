#include "mapview.h"

MapView::MapView(QWidget *parent) :QGraphicsView(parent)
{
    setDragMode(QGraphicsView::RubberBandDrag);
}

MapView::MapView(QGraphicsScene *Scene, QWidget *parent)
    :QGraphicsView(Scene, parent)
{
    setDragMode(QGraphicsView::RubberBandDrag);
}

MapView::~MapView()
{
}

void MapView::mousePressEvent(QMouseEvent *event)
{
    QGraphicsView::mousePressEvent(event);
}

void MapView::mouseMoveEvent(QMouseEvent *event)
{
    QGraphicsView::mouseMoveEvent(event);
}

void MapView::wheelEvent(QWheelEvent *event)
{
    QGraphicsView::wheelEvent(event);
}
