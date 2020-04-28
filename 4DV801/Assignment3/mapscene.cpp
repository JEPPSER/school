#include "mapscene.h"

#include <QGraphicsSceneMouseEvent>

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
}

void MapScene::mouseReleaseEvent(QGraphicsSceneMouseEvent *event)
{
}
