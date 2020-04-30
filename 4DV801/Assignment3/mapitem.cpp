#include "mapitem.h"

#include <QDebug>

MapItem::MapItem(QGraphicsItem *parent) : QGraphicsObject(parent)
{
}

MapItem::MapItem(qreal x, qreal y, int size, QGraphicsItem *parent)
    : QGraphicsObject(parent)
{
    shape << QPointF(x, y) << QPointF(x + size, y) << QPointF(x + size, y + size) << QPointF(x, y + size);
}

QRectF MapItem::boundingRect() const
{
    return shape.boundingRect();
}

void MapItem::paint(QPainter *painter, const QStyleOptionGraphicsItem *option, QWidget *widget)
{
    Q_UNUSED(option);
    Q_UNUSED(widget);

    painter->setBrush(color);
    painter->drawPolygon(shape, Qt::OddEvenFill);

    if (!hover) return;

    painter->setBrush(Qt::black);
    painter->fillRect(boundingRect().x() - 100, boundingRect().y() - 200, 200, 200, Qt::OddEvenFill);
}
