#include "mapscene.h"

#include <QGraphicsSceneMouseEvent>
#include <QDebug>

MapScene::MapScene(QObject *parent) : QGraphicsScene(parent)
{
}

MapScene::MapScene(qreal x, qreal y, qreal width, qreal height, QObject *parent)
    :QGraphicsScene(x, y, width, height, parent)
{
}

MapScene::~MapScene()
{
}

void MapScene::mousePressEvent(QGraphicsSceneMouseEvent *event)
{
}

void MapScene::mouseMoveEvent(QGraphicsSceneMouseEvent *event)
{
    MapItem *temp = dynamic_cast<MapItem *>(itemAt(event->scenePos(), QTransform()));

    if (temp != hoverItem && hoverItem != nullptr) {
        hoverItem->hover = false;
        hoverItem->setZValue(1);
    }

    if (temp != nullptr) {
        hoverItem = temp;
        hoverItem->hover = true;
        hoverItem->setZValue(100);
    }

    this->update();
}

void MapScene::mouseReleaseEvent(QGraphicsSceneMouseEvent *event)
{
}
